export type AccountLoginProps = {
  email: string;
  password: string;

  otpToken?: string;
  //TODO
  captchaData?: unknown;
};

export type AccountRegisterProps = {
  email: string;
  username: string;
  password: string;
  rePassword: string;

  languages: string[];

  captchaData?: unknown;
};

export type AccountRecoverPassProps = {
  email: string;
  //
  captchaData?: unknown;
};

export type AccountChangePassProps = {
  token: string;
  password: string;
  rePassword: string;
  //
  captchaData?: unknown;
};

export type AccountSession = {
  tokenId: string;
  os: string;
  browser: string;
  ip: string;
  updatedAt: number;
};
