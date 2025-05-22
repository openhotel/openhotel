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
import { ButtonComponent, SelectorComponent } from "@openhotel/web-components";
import { EmailComponent, UsernameComponent } from "./components";

//@ts-ignore
import styles from "./register.module.scss";

export const RegisterComponent: React.FC = () => {
  const [submittedAt, setSubmittedAt] = useState<number>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [captchaId, setCaptchaId] = useState<string>();
  const [success, setSuccess] = useState<boolean>(false);

  const { register, isLogged } = useAccount();
  let navigate = useNavigate();

  const { fetchLanguages, languages } = useLanguages();

  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  const languageOptions = useMemo(
    () =>
      languages.map((language) => ({
        key: language.code,
        value: language.name,
      })),
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
          setSuccess(true);
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

  const handleSuccessRedirect = () => {
    navigate("/login");
  };

  if (isLogged) return <RedirectComponent to="/" />;

  return success ? (
    <div className={styles.success}>
      <h1>Registration Successful</h1>
      <div>
        <p>Congratulations! You can now login to your account.</p>
        <p className={styles.warning}>
          Please verify your email address within 24 hours to prevent account
          deletion.
        </p>
      </div>
      <ButtonComponent onClick={handleSuccessRedirect}>OK</ButtonComponent>
    </div>
  ) : (
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
        {errorMessage && (
          <label key="backend-error" className={styles.error}>
            {errorMessage}
          </label>
        )}
      </form>

      <LinkComponent className={styles.link} to="/login">
        Already registered? Login here.
      </LinkComponent>
    </div>
  );
};
