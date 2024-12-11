import React, { FormEvent, useCallback, useState } from "react";
import { ButtonComponent, InputComponent } from "@oh/components";
import { LinkComponent } from "shared/components";
import { useAccount } from "shared/hooks";

//@ts-ignore
import styles from "../login/login.module.scss";

export const RecoverPasswordComponent: React.FC = () => {
  const [statusMessage, setStatusMessage] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const { recoverPassword } = useAccount();

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const data = new FormData(event.target as unknown as HTMLFormElement);
      const email = data.get("email") as string;

      recoverPassword({ email })
        .then(({ redirectUrl, message }) => {
          if (redirectUrl) window.location.replace(redirectUrl);

          setStatusMessage("Email sent");
          setErrorMessage("");
        })
        .catch(({ status, message }) => {
          setStatusMessage("");
          setErrorMessage(message);
          if (status === 500)
            setErrorMessage("Internal server error: " + message);
        });
    },
    [setStatusMessage, setErrorMessage],
  );

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={onSubmit}>
        <h1 className={styles.title}>Recover password</h1>
        <InputComponent name="email" placeholder="Email" />

        <ButtonComponent fullWidth={true}>Recover</ButtonComponent>
        {statusMessage ? (
          <label className={styles.status}>{statusMessage}</label>
        ) : null}
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
