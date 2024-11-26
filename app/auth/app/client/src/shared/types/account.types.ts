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
