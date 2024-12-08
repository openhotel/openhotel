export type AccountLoginProps = {
  email: string;
  password: string;

  otpToken?: string;
  captchaId?: string;
};

export type AccountRegisterProps = {
  email: string;
  username: string;
  password: string;
  rePassword: string;

  captchaId?: string;
};

export type AccountRecoverPassProps = {
  email: string;
};

export type AccountChangePassProps = {
  token: string;
  password: string;
  rePassword: string;
};
