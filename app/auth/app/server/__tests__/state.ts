import * as OTPAuth from "otp";
import { USER_AGENTS } from "./consts.ts";

export const State = () => {
  const getObject = (): any => {
    try {
      return JSON.parse(Deno.readTextFileSync("__state.json"));
    } catch (e) {
      return {};
    }
  };

  const setObject = (data: any) => {
    Deno.writeTextFileSync(
      "__state.json",
      JSON.stringify(
        {
          ...getObject(),
          ...data,
        },
        null,
        2,
      ),
    );
  };

  const setUser = (email: string, user: any) => {
    setObject({
      users: {
        ...(getObject()?.users || {}),
        [email]: {
          ...(getUser(email) || {}),
          ...user,
        },
      },
    });
  };

  const getUser = (email: string) => {
    const { users } = getObject();
    return (users || {})[email] ?? {};
  };

  const getSessionHeaders = (email: string) => {
    const userData = getUser(email);
    return {
      "account-id": userData.accountId,
      token: userData.token,
      "refresh-token": userData.refreshToken,
      "user-agent": USER_AGENTS.FIREFOX,
      "x-forwarded-for": "23.23.23.23",
    };
  };

  const generateOtp = (email: string) => {
    const { otpUri } = getUser(email);
    const otpURL = new URL(otpUri);
    const totp = new OTPAuth.TOTP({
      issuer: otpURL.searchParams.get("issuer")!,
      algorithm: otpURL.searchParams.get("algorithm")!,
      digits: parseInt(otpURL.searchParams.get("digits")!),
      period: parseInt(otpURL.searchParams.get("period")!),
      secret: otpURL.searchParams.get("secret")!,
    });

    return totp.generate();
  };

  const setHotel = (name: string, hotel: any) => {
    setObject({
      hotels: {
        ...(getObject()?.hotels || {}),
        [name]: {
          ...(getHotel(name) || {}),
          ...hotel,
        },
      },
    });
  };

  const getHotel = (name: string) => {
    const { hotels } = getObject();
    return (hotels || {})[name] ?? {};
  };

  return {
    setUser,
    getUser,
    getSessionHeaders,

    setHotel,
    getHotel,

    generateOtp,

    setObject,
    getObject,
  };
};

export const STATE = State();
