export enum MailTypes {
  VERIFY,
  CHANGE_PASSWORD,
}

export interface VerifyData {
  verifyUrl: string;
}

export interface ChangePasswordData {
  resetUrl: string;
}

export type MailDataMap = {
  [MailTypes.VERIFY]: VerifyData;
  [MailTypes.CHANGE_PASSWORD]: ChangePasswordData;
};

export type MailTemplate<T> = (data: T) => {
  subject: string;
  text: string;
  html: string;
};
