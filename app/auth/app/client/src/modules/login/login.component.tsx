import React, { FormEvent, useCallback, useState } from "react";
import {
  CaptchaComponent,
  LinkComponent,
  RedirectComponent,
} from "shared/components";
import { useAccount } from "shared/hooks";
import styles from "./login.module.scss";
import { useNavigate } from "react-router-dom";
import { ButtonComponent, InputComponent } from "@oh/components";

export const LoginComponent: React.FC = () => {
  const [submittedAt, setSubmittedAt] = useState<number>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [captchaId, setCaptchaId] = useState<string>(null);
  const [showOTP, setShowOTP] = useState<boolean>(false);
  const [showCaptcha, setShowCaptcha] = useState<boolean>(false);

  const { login, isLogged } = useAccount();
  const navigate = useNavigate();

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const data = new FormData(event.target as unknown as HTMLFormElement);
      const email = data.get("email") as string;
      const password = data.get("password") as string;
      const otpToken = data.get("otpToken") as string;

      login({ email, password, captchaId, otpToken })
        .then(() => navigate("/"))
        .catch(({ status, message }) => {
          if (status === 461 || status === 451) setShowCaptcha(true);
          if (status === 461 || status === 441) setShowOTP(true);
          setSubmittedAt(performance.now());
          setErrorMessage(message);
          if (status === 500)
            setErrorMessage("Internal server error: " + message);
        });
    },
    [captchaId, navigate, setSubmittedAt, setErrorMessage],
  );

  if (isLogged === null) return <div>Loading...</div>;
  if (isLogged) return <RedirectComponent to="/" />;

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={onSubmit}>
        <h1 className={styles.title}>Login</h1>
        <InputComponent name="email" placeholder="Email" autoComplete="email" />
        <InputComponent
          name="password"
          placeholder="Password"
          type="password"
          autoComplete="current-password"
        />

        {showCaptcha && (
          <CaptchaComponent
            submittedAt={submittedAt}
            onResolve={setCaptchaId}
          />
        )}
        {showOTP && (
          <InputComponent
            name="otpToken"
            placeholder="One Time Password"
            maxLength={6}
          />
        )}
        <ButtonComponent fullWidth={true}>Login</ButtonComponent>
        {errorMessage ? (
          <label className={styles.error}>{errorMessage}</label>
        ) : null}
      </form>

      <LinkComponent className={styles.link} to="/register">
        No account? Register here.
      </LinkComponent>

      <LinkComponent className={styles.recoverPass} to="/recover-password">
        Forgot your password? Click here.
      </LinkComponent>
    </div>
  );
};
