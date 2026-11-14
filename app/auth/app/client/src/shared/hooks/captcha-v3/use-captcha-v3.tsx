import { useContext } from "react";
import { CaptchaV3Context, CaptchaV3State } from "./captcha-v3.context";

export const useCaptchaV3 = (): CaptchaV3State => {
  const context = useContext(CaptchaV3Context);
  if (!context) {
    throw new Error("useCaptchaV3 must be used within an CaptchaV3Provider");
  }
  return context;
};
