import React, { FormEvent, useCallback, useEffect, useState } from "react";
import {
  CaptchaComponent,
  LinkComponent,
  RedirectComponent,
} from "shared/components";
import { useAccount } from "shared/hooks";
import styles from "./login.module.scss";
import { useNavigate } from "react-router-dom";

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
        });
    },
    [captchaId, navigate, setSubmittedAt, setErrorMessage],
  );

  if (isLogged === null) return <div>Loading...</div>;
  if (isLogged) return <RedirectComponent to="/" />;

  return (
    <div>
      <form className={styles.form} onSubmit={onSubmit}>
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" type="password" />
        {showCaptcha && (
          <CaptchaComponent
            submittedAt={submittedAt}
            onResolve={setCaptchaId}
          />
        )}
        {showOTP && <input name="otpToken" placeholder="otp" maxLength={6} />}
        <button type="submit">Login</button>
        {errorMessage ? <label>{errorMessage}</label> : null}
      </form>
      <LinkComponent to="/register">/register</LinkComponent>
    </div>
  );
};
