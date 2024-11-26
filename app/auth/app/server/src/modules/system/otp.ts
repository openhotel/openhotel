import * as OTPAuth from "otp";
import { System } from "modules/system/main.ts";

export const otp = () => {
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

  const verify = (otpSecret: string, token: string): boolean =>
    $getTOTP("", otpSecret).validate({ token }) === 0;

  const isOTPVerified = async (accountId: string): Promise<boolean> => {
    const accountOTP = await System.db.get(["otpByAccountId", accountId]);

    return Boolean(accountOTP?.verified);
  };

  const generateOTP = async (
    accountId: string,
    email: string,
  ): Promise<string> => {
    const secret = generateSecret();
    const uri = generateURI(email, secret);
    await System.db.set(["otpByAccountId", accountId], {
      secret,
      verified: false,
    });

    return uri;
  };

  return {
    generateSecret,
    generateURI,
    verify,

    generateOTP,
    isOTPVerified,
  };
};
