import React, { FormEvent, useCallback, useState } from "react";
import styles from "../login/login.module.scss";
import { ButtonComponent } from "@oh/components";
import { LinkComponent, RedirectComponent } from "../../shared/components";
import { useAccount } from "../../shared/hooks";
import { PasswordComponent } from "../register";
import { useNavigate } from "react-router-dom";

export const ChangePasswordComponent: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>();

  const { changePassword } = useAccount();
  const navigate = useNavigate();

  // Change password auth token
  const token = new URLSearchParams(window.location.search).get("token");

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const data = new FormData(event.target as unknown as HTMLFormElement);
      const password = data.get("password") as string;
      const rePassword = data.get("rePassword") as string;

      changePassword({ token, password, rePassword })
        .then(() => navigate("/login"))
        .catch(({ status, message }) => {
          setErrorMessage(message);
          if (status === 500)
            setErrorMessage("Internal server error: " + message);
        });
    },
    [navigate, setErrorMessage],
  );

  if (!token) return <RedirectComponent to="/" />;

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={onSubmit}>
        <h1 className={styles.title}>Change password</h1>
        <PasswordComponent />

        <ButtonComponent fullWidth={true}>Change</ButtonComponent>
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
