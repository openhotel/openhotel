import * as OTPAuth from "otp";
import { System } from "modules/system/main.ts";

export const otp = () => {
  const $getTOTP = (email: string, otpSecret: string): OTPAuth.TOTP =>
    new OTPAuth.TOTP({
      issuer: `openhotel${System.getEnvs().isDevelopment ? "::development" : ""}`,
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

  return {
    generateSecret,
    generateURI,
    verify,
  };
};
