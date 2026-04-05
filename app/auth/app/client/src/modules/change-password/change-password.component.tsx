import React, { FormEvent, useCallback, useState } from "react";
import { ButtonComponent } from "@openhotel/web-components";
import {
  LinkComponent,
  PasswordComponent,
  RedirectComponent,
} from "shared/components";
import { useAccount, useCaptchaV2 } from "shared/hooks";
import { useNavigate } from "react-router-dom";
import styles from "./change-password.module.scss";

export const ChangePasswordComponent: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { submit, captchaReady } = useCaptchaV2();
  const { changePassword } = useAccount();
  const navigate = useNavigate();

  // Change password auth token
  const token = new URLSearchParams(window.location.search).get("token");

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!captchaReady || isSubmitting) return;
      setIsSubmitting(true);

      const data = new FormData(event.target as unknown as HTMLFormElement);
      const password = data.get("password") as string;
      const rePassword = data.get("rePassword") as string;

      const captchaData = await submit();

      changePassword({ token, password, rePassword, captchaData })
        .then(() => navigate("/login"))
        .catch(({ status, message }) => {
          setErrorMessage(message);
          if (status === 500)
            setErrorMessage("Internal server error: " + message);
        })
        .finally(() => setIsSubmitting(false));
    },
    [navigate, setErrorMessage, captchaReady, setIsSubmitting, isSubmitting],
  );

  if (!token) return <RedirectComponent to="/" />;

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={onSubmit}>
        <h1 className={styles.title}>Change password</h1>
        <PasswordComponent />

        <ButtonComponent
          fullWidth={true}
          loading={!captchaReady || isSubmitting}
        >
          Change
        </ButtonComponent>
        {errorMessage ? (
          <label className={styles.error}>{errorMessage}</label>
        ) : null}
      </form>

      <LinkComponent className={styles.link} to="/login">
        Go back
      </LinkComponent>
    </div>
  );
};
