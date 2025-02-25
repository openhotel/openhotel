import { System } from "modules/system/main.ts";
import {
  AccountCreation,
  AccountMutable,
  AccountMutableGet,
  AccountUpdate,
  DbAccount,
  PublicAccount,
} from "shared/types/account.types.ts";
import {
  compareIps,
  compareToken,
  encryptToken,
  getIpFromRequest,
  getRandomString,
  getSHA256HashText,
  getTokenData,
  HttpStatusCode,
} from "@oh/utils";
import { otp } from "./otp.ts";
import { github } from "./github.ts";
import { admins } from "./admins.ts";
import { HotelCreation, HotelMutableGet } from "shared/types/hotel.types.ts";
import { hotels } from "./hotels.ts";
import { connections } from "./connections/main.ts";
import { ulid } from "@std/ulid";
import { getUserAgentData } from "shared/utils/user-agent.utils.ts";
import {
  discordNotify,
  getRandomDiscordMessage,
} from "shared/utils/discord.utils.ts";
import { getHiddenMail } from "shared/utils/mail.utils.ts";
import { MailTypes } from "shared/types/mail.types.ts";

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

    const passwordHash = await System.db.crypto.encryptPassword(password);

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

    // --- Email things
    {
      const emailHash = await getEmailHash(email);

      await System.db.set(["accountsByEmail", emailHash], accountId, expire);

      const encryptedEmail = await System.db.crypto.encryptSHA256(email);
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
          verifyTokensHash: encryptToken(verifyToken),
        },
        {
          expireIn,
        },
      );

      const verifyUrl = `${apiUrl}/verify?id=${verifyId}&token=${verifyToken}`;

      System.email.send(MailTypes.VERIFY, email, { verifyUrl });
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
    if (!verifyData || !compareToken(token, verifyData.verifyTokensHash))
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
      if (!connection || !compareToken(token, connection.tokenHash))
        return null;

      return await get(connection.accountId);
    } catch (e) {
      return null;
    }
  };

  const verifyAppConnection = async (
    appToken: string,
    accountId: string,
    token: string,
  ): Promise<boolean> => {
    const { id: tokenId } = getTokenData(appToken);

    const appConnection = await System.db.get([
      "appConnectionByAccount",
      accountId,
      tokenId,
    ]);

    return (
      Boolean(appConnection) && compareToken(token, appConnection.hashedToken)
    );
  };

  const getByRequest = async (request: Request) => {
    const connectionToken = request.headers.get("connection-token");
    if (connectionToken) return getByConnectionToken(connectionToken);

    const accountId = request.headers.get("account-id");
    const accountToken = request.headers.get("account-token");
    const appToken = request.headers.get("app-token");
    if (
      appToken &&
      !(await verifyAppConnection(appToken, accountId, accountToken))
    )
      return null;

    if (accountId) return get(accountId);

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
      return System.db.crypto.comparePassword(password, account.passwordHash);
    };

    const createTokens = async (request: Request) => {
      let tokenId = getRandomString(4);

      const $currentToken =
        request.headers.get("token") ?? request.headers.get("refresh-token");
      if ($currentToken?.length === 64) tokenId = $currentToken.substring(0, 4);

      const token = getRandomString(60);
      const refreshToken = getRandomString(60);

      const userAgent = request.headers.get("user-agent");
      const ip = getIpFromRequest(request);
      const fingerprint = request.headers.get("fingerprint");

      const {
        times: { accountTokenDays, accountRefreshTokenDays },
      } = System.getConfig();
      const expireInToken = accountTokenDays * 24 * 60 * 60 * 1000;
      const expireInRefreshToken =
        accountRefreshTokenDays * 24 * 60 * 60 * 1000;

      await System.db.set(
        ["accountsByToken", account.accountId, tokenId],
        {
          userAgent,
          ip,
          fingerprint,
          tokenHash: encryptToken(token),
          updatedAt: Date.now(),
        },
        {
          expireIn: expireInToken,
        },
      );
      await System.db.set(
        ["accountsByRefreshToken", account.accountId, tokenId],
        {
          userAgent,
          ip,
          fingerprint,
          refreshTokenHash: encryptToken(refreshToken),
          updatedAt: Date.now(),
        },
        { expireIn: expireInRefreshToken },
      );

      return {
        token: tokenId + token,
        refreshToken: tokenId + refreshToken,
        durations: [accountTokenDays, accountRefreshTokenDays] as [
          number,
          number,
        ],
      };
    };

    const removeTokens = async () => {
      for (const { key } of await System.db.list({
        prefix: ["accountsByToken", account.accountId],
      }))
        await System.db.delete(key);
      for (const { key } of await System.db.list({
        prefix: ["accountsByRefreshToken", account.accountId],
      }))
        await System.db.delete(key);
    };

    const removeToken = async ($token: string) => {
      const tokenId = $token.substring(0, 4);

      await System.db.delete(["accountsByToken", account.accountId, tokenId]);
      await System.db.delete([
        "accountsByRefreshToken",
        account.accountId,
        tokenId,
      ]);
    };

    const getTokens = async () => {
      const tokens = {};

      for (const { key, value } of await System.db.list({
        prefix: ["accountsByToken", account.accountId],
      })) {
        tokens[key[2]] = {
          ...getUserAgentData(value.userAgent),
          ip: value.ip,
          updatedAt: value.updatedAt,
        };
      }
      for (const { key, value } of await System.db.list({
        prefix: ["accountsByRefreshToken", account.accountId],
      })) {
        if (!tokens[key[2]])
          tokens[key[2]] = {
            ...getUserAgentData(value.userAgent),
            ip: value.ip,
            updatedAt: value.updatedAt,
          };
      }

      return Object.keys(tokens).map((tokenId) => ({
        ...tokens[tokenId],
        tokenId,
      }));
    };

    const checkToken = async (request: Request) => {
      const $token = request.headers.get("token");
      if (!$token || $token.length !== 64) return false;

      const tokenId = $token.substring(0, 4);
      const token = $token.substring(4, 64);

      const accountsByToken = await System.db.get([
        "accountsByToken",
        account.accountId,
        tokenId,
      ]);

      const fingerprint = request.headers.get("fingerprint");

      if (!accountsByToken || accountsByToken.fingerprint !== fingerprint)
        return false;

      return compareToken(token, accountsByToken.tokenHash);
    };

    const checkRefreshToken = async (request: Request): Promise<boolean> => {
      const $refreshToken = request.headers.get("refresh-token");
      if (!$refreshToken || $refreshToken.length !== 64) return false;

      const tokenId = $refreshToken.substring(0, 4);
      const token = $refreshToken.substring(4, 64);

      const accountByRefreshToken = await System.db.get([
        "accountsByRefreshToken",
        account.accountId,
        tokenId,
      ]);

      const fingerprint = request.headers.get("fingerprint");

      if (
        !accountByRefreshToken ||
        accountByRefreshToken.fingerprint !== fingerprint
      )
        return false;

      return compareToken(token, accountByRefreshToken.refreshTokenHash);
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

      const accountsList = (await getList()).filter(
        (account) => account.verified,
      );
      discordNotify({
        content: getRandomDiscordMessage(account.username, accountsList.length),
      });
    };

    const addApp = async (appId: string): Promise<string | null> => {
      const appData = await System.apps.get(appId);
      if (!appData) return null;

      const rawToken = getRandomString(32);

      await System.db.set(
        ["appConnectionByAccount", account.accountId, appId],
        {
          hashedToken: encryptToken(rawToken),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          expireIn: 24 * 60 * 60 * 1000,
        },
      );

      const targetUrl = new URL(appData.url);
      targetUrl.hash = `accountId=${account.accountId}&accountToken=${rawToken}`;
      return targetUrl.href;
    };

    const getEmail = async (): Promise<string> => {
      const encryptedEmail = (await System.db.get([
        "emailsByHash",
        account.emailHash,
      ])) as string;

      return await System.db.crypto.decryptSHA256(encryptedEmail);
    };

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
    }: Omit<HotelCreation, "accountId">): Promise<string | null> => {
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
        const encryptedEmail = await System.db.crypto.encryptSHA256(
          $account.email,
        );

        await System.db.delete(["accountsByEmail", account.emailHash]);
        await System.db.delete(["emailsByHash", account.emailHash]);

        await System.db.set(["accountsByEmail", emailHash], account.accountId);
        await System.db.set(["emailsByHash", emailHash], encryptedEmail);

        account.emailHash = emailHash;
      }

      if ($account.password?.length) {
        account.passwordHash = await System.db.crypto.encryptPassword(
          $account.password,
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
      removeToken,
      getTokens,

      sendVerificationEmail,
      verify,

      getEmail,

      addApp,

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
    const { url: rootUrl, version } = System.getConfig();

    const isDevelopment = version === "development";

    if (
      !isDevelopment &&
      (await System.db.get(["passwordRecoverByAccount", accountData.accountId]))
    )
      return HttpStatusCode.TOO_MANY_REQUESTS;

    const resetUrl = `${rootUrl}/change-password?token=${verifyToken}`;

    const hiddenMail = getHiddenMail($email);
    console.debug("Sending email to", hiddenMail, "with url", resetUrl);
    System.email.send(MailTypes.CHANGE_PASSWORD, $email, { resetUrl });

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

    return resetUrl;
  };

  const getEmailHash = async (email: string): Promise<string> =>
    getSHA256HashText(email);

  const getEmailByHash = async (emailHash: string): Promise<string> => {
    const encryptedEmail = (await System.db.get([
      "emailsByHash",
      emailHash,
    ])) as string;

    return await System.db.crypto.decryptSHA256(encryptedEmail);
  };

  return {
    create,

    getAccountList,
    getAccount,

    sendRecover,

    getEmailHash,
    getEmailByHash,

    admins: $admins,
  };
};
