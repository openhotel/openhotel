import React, { FormEvent, useCallback, useEffect, useState } from "react";
import { CaptchaComponent, LinkComponent } from "shared/components";
import { useApi } from "shared/hooks";
import styles from "./login.module.scss";
import { useNavigate } from "react-router-dom";
export const LoginComponent: React.FC = () => {
  const [submittedAt, setSubmittedAt] = useState<number>();
  const [captchaId, setCaptchaId] = useState<string>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [showOTP, setShowOTP] = useState<boolean>(false);

  const { login, refreshSession, getTicketId } = useApi();
  let navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === "/logout") return;

    refreshSession(getTicketId())
      .then(({ redirectUrl }) => {
        if (!redirectUrl) return navigate("/account");
        window.location.href = redirectUrl;
      })
      .catch(() => {
        setLoaded(true);
        console.log("Cannot refresh session!");
      });
  }, []);

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const data = new FormData(event.target as unknown as HTMLFormElement);
      const email = data.get("email") as string;
      const password = data.get("password") as string;
      const otpToken = data.get("otpToken") as string;

      login(email, password, captchaId, getTicketId(), otpToken)
        .then(({ redirectUrl }) => {
          if (!redirectUrl) return navigate("/account");

          window.location.href = redirectUrl;
        })
        .catch(({ status }) => {
          if (status === 441) setShowOTP(true);
          setSubmittedAt(performance.now());
        });
    },
    [captchaId, getTicketId],
  );

  if (!loaded) return <div>loading...</div>;

  return (
    <div>
      <form className={styles.form} onSubmit={onSubmit}>
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" type="password" />
        <CaptchaComponent submittedAt={submittedAt} onResolve={setCaptchaId} />
        {showOTP && <input name="otpToken" placeholder="otp" maxLength={6} />}
        <button type="submit">Login</button>
      </form>
      <LinkComponent to="/register">/register</LinkComponent>
    </div>
  );
};
