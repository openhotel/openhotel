import { EMAIL_REGEX } from "@shared/consts/account.consts.ts";

export const getCensoredEmail = (email: string): string =>
  email.substring(0, 1) +
  "**@**.**" +
  email.substring(email.length - 1, email.length);

export const isEmail = (email: string): boolean =>
  new RegExp(EMAIL_REGEX).test(email);
