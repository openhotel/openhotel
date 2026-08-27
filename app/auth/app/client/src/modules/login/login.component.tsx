import React, { FormEvent, useCallback, useEffect, useState } from "react";
import { LinkComponent } from "shared/components";
import { useAccount, useCaptchaV3, useHotel } from "shared/hooks";
import { useNavigate } from "react-router-dom";
import {
  ButtonComponent,
  InputComponent,
  OtpComponent,
} from "@openhotel/web-components";

import styles from "./login.module.scss";

export const LoginComponent: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [showOTP, setShowOTP] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { solve } = useCaptchaV3();
  const { login, isLogged } = useAccount();
  const { get } = useHotel();
  const navigate = useNavigate();

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (isSubmitting) return;
      setIsSubmitting(true);

      const data = new FormData(event.target as unknown as HTMLFormElement);
      const email = data.get("email") as string;
      const password = data.get("password") as string;
      const otpToken = data.get("otpToken") as string;

      const captchaData = await solve();

      login({ email, password, otpToken, captchaData })
        .catch(({ status, message }) => {
          if (status === 461 || status === 441) setShowOTP(true);
          setErrorMessage(message);
          if (status === 500)
            setErrorMessage("Internal server error: " + message);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    },
    [navigate, setErrorMessage, solve, isSubmitting, isSubmitting],
  );

  useEffect(() => {
    if (!isLogged) return;

    const redirectData = new URLSearchParams(window.location.search).get(
      "redirect",
    );
    if (redirectData) {
      const { type, ...data } = JSON.parse(atob(redirectData));
      switch (type) {
        case "integration":
          get(data.hotelId, data.integrationId)
            .then(({ redirectUrl }) => {
              window.location.replace(redirectUrl);
            })
            .catch(() => navigate("/"));
          break;
        case "app":
          navigate(`/apps?appId=${data.appId}`);
          break;
      }
    } else navigate("/");
  }, [isLogged, navigate, get]);

  if (isLogged === null) return <div>Loading...</div>;

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

        {showOTP && (
          <OtpComponent
            wrapperClassName={styles.otp}
            className={styles.otpInput}
            name="otpToken"
          />
        )}
        <ButtonComponent loading={isSubmitting} fullWidth={true}>
          Login
        </ButtonComponent>
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
