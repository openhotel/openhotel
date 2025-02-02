import { getEmailByHash } from "shared/utils/account.utils.ts";
import { System } from "modules/system/main.ts";
import * as OTPAuth from "otp";
import { AccountOtpMutable, DbAccount } from "shared/types/account.types.ts";

export const otp = (account: DbAccount): AccountOtpMutable => {
  const $getTOTP = (email: string, otpSecret: string): OTPAuth.TOTP =>
    new OTPAuth.TOTP({
      issuer: `openhotel${System.getConfig().version === "development" ? "::development" : ""}`,
      label: email,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(otpSecret),
    });

  const generateSecret = (): string => new OTPAuth.Secret({ size: 32 }).base32;

  const generateURI = (email: string, otpSecret: string): string =>
    $getTOTP(email, otpSecret).toString();

  const create = async (): Promise<string> => {
    const email = await getEmailByHash(account.emailHash);

    const secret = generateSecret();
    const uri = generateURI(email, secret);
    await System.db.set(
      ["otpByAccountId", account.accountId],
      {
        secret,
        verified: false,
      },
      { expireIn: 60 * 60 * 1000 /* 1h */ },
    );

    return uri;
  };

  const check = async (token: string): Promise<boolean> => {
    const otp = await System.db.get(["otpByAccountId", account.accountId]);
    //otp non existent or not verified
    if (!otp || !otp.verified) return true;
    return token && $getTOTP("", otp.secret).validate({ token }) === 0;
  };

  const verify = async () => {
    const otp = await System.db.get(["otpByAccountId", account.accountId]);
    await System.db.set(["otpByAccountId", account.accountId], {
      ...otp,
      verified: true,
    });
  };

  const isVerified = async (): Promise<boolean> => {
    const otp = await System.db.get(["otpByAccountId", account.accountId]);
    return Boolean(otp?.verified);
  };

  const remove = async () => {
    await System.db.delete(["otpByAccountId", account.accountId]);
  };

  return {
    create,
    check,
    verify,
    isVerified,
    remove,
  };
};
