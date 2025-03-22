import { BCRYPT_MAX_LENGTH } from "shared/consts/password.consts.ts";

export const getHiddenMail = (mail: string) =>
  `${mail.substring(0, 3)}***${mail.substring(mail.length - 3)}`;

export const getEmailMaxLength = () => BCRYPT_MAX_LENGTH;
