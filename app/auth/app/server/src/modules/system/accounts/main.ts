import { System } from "modules/system/main.ts";
import {
  DbAccount,
  AccountCreation,
  AccountMutable,
  AccountMutableGet,
  PublicAccount,
  AccountUpdate,
} from "shared/types/account.types.ts";
import {
  getEmailByHash,
  getEmailHash,
  getEncryptedEmail,
} from "shared/utils/account.utils.ts";
import { pepperPassword } from "shared/utils/pepper.utils.ts";
import * as bcrypt from "@da/bcrypt";
import {
  getRandomString,
  getIpFromRequest,
  HttpStatusCode,
  compareIps,
  getTokenData,
} from "@oh/utils";

import { otp } from "./otp.ts";
import { github } from "./github.ts";
import { admins } from "./admins.ts";
import { HotelCreation, HotelMutableGet } from "shared/types/hotel.types.ts";
import { hotels } from "./hotels.ts";
import { connections } from "./connections/main.ts";
import { ulid } from "jsr:@std/ulid@1";

export const accounts = () => {
  const $admins = admins();

  const create = async ({
    email,
    username,
    password,
    languages,
  }: AccountCreation) => {
    const accountId = ulid();

    const {
      email: { enabled: isEmailVerificationEnabled },
      times: { accountWithoutVerificationDays },
    } = System.getConfig();

    email = email.toLowerCase();
    const emailHash = await getEmailHash(email);

    const passWithPepper = await pepperPassword(password);
    const passwordHash = bcrypt.hashSync(passWithPepper, bcrypt.genSaltSync(8));

    const accountData: DbAccount = {
      accountId,
      username,
      emailHash,
      passwordHash,
      languages,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      verified: !isEmailVerificationEnabled,
    };

    const expireIn = accountWithoutVerificationDays * 24 * 60 * 60 * 1000;

    const expire = isEmailVerificationEnabled
      ? {
          expireIn,
        }
      : {};

    await System.db.set(["accounts", accountId], accountData, expire);

    await $sendVerificationEmail(accountId, email, username);
  };

  const $sendVerificationEmail = async (
    accountId: string,
    email: string,
    username: string,
  ) => {
    const {
      email: { enabled: isEmailVerificationEnabled },
      times: { accountWithoutVerificationDays },
      url: apiUrl,
    } = System.getConfig();

    const verifyId = getRandomString(16);
    const verifyToken = getRandomString(32);

    const expireIn = accountWithoutVerificationDays * 24 * 60 * 60 * 1000;

    const expire = isEmailVerificationEnabled
      ? {
          expireIn,
        }
      : {};

    const emailHash = await getEmailHash(email);
    // --- Email things
    {
      await System.db.set(["accountsByEmail", emailHash], accountId, expire);
      const encryptedEmail = await getEncryptedEmail(email);
      await System.db.set(["emailsByHash", emailHash], encryptedEmail, expire);
    }
    // --- Username things ---
    {
      await System.db.set(
        ["accountsByUsername", username.toLowerCase()],
        accountId,
        expire,
      );
    }
    // --- Verification things ---
    if (isEmailVerificationEnabled) {
      await System.db.set(
        ["accountsByVerifyId", verifyId],
        {
          accountId,
          verifyTokensHash: bcrypt.hashSync(verifyToken, bcrypt.genSaltSync(8)),
        },
        {
          expireIn,
        },
      );

      const verifyUrl = `${apiUrl}/verify?id=${verifyId}&token=${verifyToken}`;

      System.email.send(
        email,
        "verify your account",
        verifyUrl,
        `<a href="${verifyUrl}">${verifyUrl}<p/>`,
      );
    }
  };

  const getList = async (): Promise<DbAccount[]> =>
    (await System.db.list({ prefix: ["accounts"] })).map(({ value }) => value);

  const get = async (accountId: string): Promise<DbAccount> =>
    await System.db.get(["accounts", accountId]);

  const getByUsername = async (username: string): Promise<DbAccount | null> => {
    const accountId = await System.db.get([
      "accountsByUsername",
      username.toLowerCase(),
    ]);
    if (!accountId) return null;
    return await get(accountId);
  };

  const getByEmail = async (email: string): Promise<DbAccount | null> => {
    const accountId = await System.db.get([
      "accountsByEmail",
      await getEmailHash(email.toLowerCase()),
    ]);
    if (!accountId) return null;
    return await get(accountId);
  };

  const getByRecoverToken = async (
    recoverToken: string,
  ): Promise<DbAccount | null> => {
    const recoverData = await System.db.get(["passwordRecover", recoverToken]);
    if (!recoverData) return null;

    await System.db.delete(["passwordRecover", recoverToken]);
    await System.db.delete(["passwordRecoverByAccount", recoverData.accountId]);

    return await get(recoverData.accountId);
  };

  const getByVerify = async (
    id: string,
    token: string,
  ): Promise<DbAccount | null> => {
    const verifyData = await System.db.get(["accountsByVerifyId", id]);
    if (!verifyData || !bcrypt.compareSync(token, verifyData.verifyTokensHash))
      return null;

    await System.db.delete(["accountsByVerifyId", id]);

    return await get(verifyData.accountId);
  };

  const getByConnectionId = async (
    connectionId: string,
  ): Promise<DbAccount | null> => {
    const accountByConnectionId = await System.db.get([
      "accountByActiveIntegrationConnectionId",
      connectionId,
    ]);
    if (!accountByConnectionId) return null;

    const connection = await System.db.get([
      "activeIntegrationConnectionByAccountId",
      accountByConnectionId,
    ]);
    if (!connection) return null;

    return await get(connection.accountId);
  };

  const getByConnectionToken = async (
    connectionToken: string,
  ): Promise<DbAccount | null> => {
    try {
      const { id: connectionId, token } = getTokenData(connectionToken);

      const accountByConnectionId = await System.db.get([
        "accountByActiveIntegrationConnectionId",
        connectionId,
      ]);
      if (!accountByConnectionId) return null;

      const connection = await System.db.get([
        "activeIntegrationConnectionByAccountId",
        accountByConnectionId,
      ]);
      if (!connection || !bcrypt.compareSync(token, connection.tokenHash))
        return null;

      return await get(connection.accountId);
    } catch (e) {
      return null;
    }
  };

  const getByRequest = async (request: Request) => {
    const accountId = request.headers.get("account-id");
    if (accountId) return get(accountId);

    const connectionToken = request.headers.get("connection-token");
    if (connectionToken) return getByConnectionToken(connectionToken);

    return null;
  };

  const getAccount = async ({
    username: $username,
    accountId: $accountId,
    email: $email,
    recoverToken: $recoverToken,
    verifyId: $verifyId,
    verifyToken: $verifyToken,
    connectionId: $connectionId,
    request: $request,
  }: AccountMutableGet): Promise<AccountMutable> => {
    let account: DbAccount;

    if ($accountId) account = await get($accountId);
    // else if ($request) account = await getByRequest($request);
    else if ($email) account = await getByEmail($email);
    else if ($username) account = await getByUsername($username);
    else if ($recoverToken) account = await getByRecoverToken($recoverToken);
    else if ($verifyId && $verifyToken)
      account = await getByVerify($verifyId, $verifyToken);
    else if ($connectionId) account = await getByConnectionId($connectionId);
    // else if ($connectionToken)
    //   account = await getByConnectionToken($connectionToken);
    else if ($request) account = await getByRequest($request);

    if (!account) return null;

    const $otp = otp(account);
    const $github = github(account);
    const $hotels = hotels(account);
    const $connections = connections(account);

    const checkPassword = async (password: string): Promise<boolean> => {
      return bcrypt.compareSync(
        await pepperPassword(password),
        account.passwordHash,
      );
    };

    const createTokens = async (request: Request) => {
      const token = getRandomString(54);
      const refreshToken = getRandomString(64);

      const userAgent = request.headers.get("user-agent");
      const ip = getIpFromRequest(request);

      const {
        times: { accountTokenDays, accountRefreshTokenDays },
      } = System.getConfig();
      const expireInToken = accountTokenDays * 24 * 60 * 60 * 1000;
      const expireInRefreshToken =
        accountRefreshTokenDays * 24 * 60 * 60 * 1000;

      await System.db.set(
        ["accountsByToken", account.accountId],
        {
          userAgent,
          ip,
          tokenHash: bcrypt.hashSync(token, bcrypt.genSaltSync(8)),
        },
        {
          expireIn: expireInToken,
        },
      );
      await System.db.set(
        ["accountsByRefreshToken", account.accountId],
        {
          userAgent,
          ip,
          refreshTokenHash: bcrypt.hashSync(
            refreshToken,
            bcrypt.genSaltSync(8),
          ),
        },
        { expireIn: expireInRefreshToken },
      );

      return {
        token,
        refreshToken,
        durations: [accountTokenDays, accountRefreshTokenDays] as [
          number,
          number,
        ],
      };
    };

    const removeTokens = async () => {
      await System.db.delete(["accountsByToken", account.accountId]);
      await System.db.delete(["accountsByRefreshToken", account.accountId]);
    };

    const checkToken = async (request: Request) => {
      const token = request.headers.get("token");
      if (!token) return false;

      const accountsByToken = await System.db.get([
        "accountsByToken",
        account.accountId,
      ]);

      const userAgent = request.headers.get("user-agent");
      const ip = getIpFromRequest(request);

      if (
        !accountsByToken ||
        accountsByToken.userAgent !== userAgent ||
        !compareIps(ip, accountsByToken.ip)
      )
        return false;

      return bcrypt.compareSync(token, accountsByToken.tokenHash);
    };

    const checkRefreshToken = async (request: Request): Promise<boolean> => {
      const refreshToken = request.headers.get("refresh-token");

      const accountByRefreshToken = await System.db.get([
        "accountsByRefreshToken",
        account.accountId,
      ]);

      const userAgent = request.headers.get("user-agent");
      const ip = getIpFromRequest(request);

      if (
        !accountByRefreshToken ||
        accountByRefreshToken.userAgent !== userAgent ||
        !compareIps(ip, accountByRefreshToken.ip)
      )
        return false;

      return bcrypt.compareSync(
        refreshToken,
        accountByRefreshToken.refreshTokenHash,
      );
    };

    const sendVerificationEmail = async () => {
      const email = await getEmailByHash(account.emailHash);
      await $sendVerificationEmail(account.accountId, email, account.username);
    };
    const verify = async () => {
      await update({
        email: await getEmail(),
        username: account.username,
        verified: true,
      });
    };

    const getEmail = async (): Promise<string> =>
      await getEmailByHash(account.emailHash);

    const isAdmin = async () => Boolean(await $admins.get(account.accountId));
    const setAdmin = async (admin: boolean) => {
      await (admin
        ? $admins.set(account.accountId)
        : $admins.remove(account.accountId));
    };

    const getHotels = async () =>
      await System.hotels.getHotelList({ accountId: account.accountId });
    const getHotel = async (data: HotelMutableGet) => {
      const hotel = await System.hotels.getHotel(data);
      if (!hotel || hotel.getObject().accountId !== account.accountId)
        return null;
      return hotel;
    };

    const createHotel = async ({
      name,
      public: $public,
    }: HotelCreation): Promise<string | null> => {
      const hotels = await getHotels();
      if (hotels.length >= System.getConfig().accounts.maxHotels) return null;

      return await System.hotels.create({
        accountId: account.accountId,
        public: $public,
        name,
      });
    };

    const getObject = (): DbAccount => account;
    const getPublicObject = async (): Promise<PublicAccount> => ({
      accountId: account.accountId,
      username: account.username,
      email: await getEmail(),
      admin: Boolean(await System.accounts.admins.get(account.accountId)),
      otp: await $otp.isVerified(),
      updatedAt: account.updatedAt,
      createdAt: account.createdAt,
      verified: account.verified,
      languages: account.languages,
      githubLogin: account.githubLogin,
    });

    const update = async ($account: AccountUpdate) => {
      if ($account.email?.length) {
        $account.email = $account.email.toLowerCase();
        const emailHash = await getEmailHash($account.email);
        const encryptedEmail = await getEncryptedEmail($account.email);

        await System.db.delete(["accountsByEmail", account.emailHash]);
        await System.db.delete(["emailsByHash", account.emailHash]);

        await System.db.set(["accountsByEmail", emailHash], account.accountId);
        await System.db.set(["emailsByHash", emailHash], encryptedEmail);

        account.emailHash = emailHash;
      }

      if ($account.password?.length) {
        const passWithPepper = await pepperPassword($account.password);
        account.passwordHash = bcrypt.hashSync(
          passWithPepper,
          bcrypt.genSaltSync(8),
        );
      }

      if ($account.username?.length) {
        await System.db.delete([
          "accountsByUsername",
          account.username.toLowerCase(),
        ]);

        $account.username = $account.username.toLowerCase();

        await System.db.set(
          ["accountsByUsername", $account.username],
          account.accountId,
        );
      } else $account.username = account.username;

      delete $account.email;
      delete $account.password;

      await System.db.set(["accounts", account.accountId], {
        ...account,
        ...$account,
        updatedAt: Date.now(),
      });
    };

    const remove = async () => {
      await removeTokens();

      await $admins.remove(account.accountId);

      await $github.unlink();
      await $otp.remove();
      await $connections.removeAll();

      for (const hotel of await getHotels()) await hotel.remove();

      await System.db.delete(["accounts", account.accountId]);
      await System.db.delete(["accountsByRefreshToken", account.accountId]);
      await System.db.delete(["accountsByToken", account.accountId]);
      await System.db.delete([
        "accountsByUsername",
        account.username.toLowerCase(),
      ]);

      await System.db.delete(["accountsByEmail", account.emailHash]);
      await System.db.delete(["emailsByHash", account.emailHash]);

      await System.db.delete(["githubState", account.accountId]);

      await System.accounts.admins.remove(account.accountId);

      //remove recover account data
      {
        const recoverAccountId = await System.db.get([
          "passwordRecoverByAccount",
          account.accountId,
        ]);
        if (recoverAccountId) {
          await System.db.delete(["passwordRecover", recoverAccountId]);
          await System.db.delete([
            "passwordRecoverByAccount",
            account.accountId,
          ]);
        }
      }
    };

    return {
      checkPassword,

      checkToken,
      checkRefreshToken,
      createTokens,
      removeTokens,

      sendVerificationEmail,
      verify,

      getEmail,

      isAdmin,
      setAdmin,

      getHotels,
      getHotel,
      createHotel,

      getObject,
      getPublicObject,

      update,
      remove,

      otp: $otp,
      github: $github,
      hotels: $hotels,
      connections: $connections,
    };
  };

  const getAccountList = async (): Promise<AccountMutable[]> => {
    return await Promise.all((await getList()).map(getAccount));
  };

  const sendRecover = async (
    $email: string,
  ): Promise<null | HttpStatusCode | string> => {
    const account = await getAccount({ email: $email });

    if (!account) return null;

    const accountData = account.getObject();

    const verifyToken = getRandomString(16);
    const { url: rootUrl, email, version } = System.getConfig();

    const isDevelopment = version === "development";

    if (
      !isDevelopment &&
      (await System.db.get(["passwordRecoverByAccount", accountData.accountId]))
    )
      return HttpStatusCode.TOO_MANY_REQUESTS;

    const verifyUrl = `${rootUrl}/change-password?token=${verifyToken}`;

    if (email.enabled) {
      console.debug("Sending email to", $email, "with url", verifyUrl);
      System.email.send(
        $email,
        "Change your account password",
        verifyUrl,
        `<a href="${verifyUrl}">${verifyUrl}<p/>`,
      );
    }

    const expireIn = 60 * 60 * 1000; /* 1h */

    await System.db.set(
      ["passwordRecover", verifyToken],
      {
        accountId: accountData.accountId,
        token: verifyToken,
        createdAt: Date.now(),
      },
      { expireIn },
    );
    await System.db.set(
      ["passwordRecoverByAccount", accountData.accountId],
      verifyToken,
      {
        expireIn,
      },
    );

    return verifyUrl;
  };

  return {
    create,

    getAccountList,
    getAccount,

    sendRecover,

    admins: $admins,
  };
};
