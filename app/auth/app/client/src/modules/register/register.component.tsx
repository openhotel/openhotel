import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CaptchaComponent,
  LinkComponent,
  PasswordComponent,
  RedirectComponent,
} from "shared/components";
import { useAccount, useLanguages } from "shared/hooks";
import { useNavigate } from "react-router-dom";
import { ButtonComponent, SelectorComponent } from "@oh/components";
import { EmailComponent, UsernameComponent } from "./components";

//@ts-ignore
import styles from "./register.module.scss";

export const RegisterComponent: React.FC = () => {
  const [submittedAt, setSubmittedAt] = useState<number>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [captchaId, setCaptchaId] = useState<string>();

  const { register, isLogged } = useAccount();
  let navigate = useNavigate();

  const { fetchLanguages, languages } = useLanguages();

  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  const languageOptions = useMemo(
    () => languages.map((language) => ({ key: language, value: language })),
    [languages],
  );

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const data = new FormData(event.target as unknown as HTMLFormElement);
      const email = data.get("email") as string;
      const username = data.get("username") as string;
      const password = data.get("password") as string;
      const rePassword = data.get("rePassword") as string;
      const language = data.get("language") as string;

      register({
        email,
        username,
        password,
        rePassword,
        captchaId,
        languages: [language],
      })
        .then(() => {
          navigate("/login");
        })
        .catch(({ status, message }) => {
          setSubmittedAt(performance.now());
          setErrorMessage(message);
          if (status === 500)
            setErrorMessage("Internal server error: " + message);
        });
    },
    [captchaId, navigate],
  );

  if (isLogged) return <RedirectComponent to="/" />;

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={onSubmit}>
        <h1 className={styles.title}>Register</h1>
        <EmailComponent />
        <UsernameComponent />
        <PasswordComponent />
        <SelectorComponent
          placeholder="Language"
          name="language"
          options={languageOptions}
          clearable={false}
        />
        <CaptchaComponent submittedAt={submittedAt} onResolve={setCaptchaId} />
        <ButtonComponent fullWidth>Register</ButtonComponent>
        {errorMessage ? (
          <label key="backend-error" className={styles.error}>
            {errorMessage}
          </label>
        ) : null}
      </form>
      <LinkComponent className={styles.link} to="/login">
        Already registered? Login here.
      </LinkComponent>
    </div>
  );
};
