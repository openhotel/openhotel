import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  LinkComponent,
  PasswordComponent,
  RedirectComponent,
} from "shared/components";
import { useAccount, useCaptchaV2, useLanguages } from "shared/hooks";
import { useNavigate } from "react-router-dom";
import { ButtonComponent, SelectorComponent } from "@openhotel/web-components";
import { EmailComponent, UsernameComponent } from "./components";
import styles from "./register.module.scss";

export const RegisterComponent: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [success, setSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { submit, captchaReady } = useCaptchaV2();
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
      if (!captchaReady || isSubmitting) return;
      setIsSubmitting(true);

      const data = new FormData(event.target as unknown as HTMLFormElement);
      const email = data.get("email") as string;
      const username = data.get("username") as string;
      const password = data.get("password") as string;
      const rePassword = data.get("rePassword") as string;
      const language = data.get("language") as string;

      const captchaData = await submit();

      register({
        email,
        username,
        password,
        rePassword,
        languages: [language],
        captchaData,
      })
        .then(() => {
          setSuccess(true);
        })
        .catch(({ status, message }) => {
          setErrorMessage(message);
          if (status === 500)
            setErrorMessage("Internal server error: " + message);
        })
        .finally(() => setIsSubmitting(false));
    },
    [navigate, submit, captchaReady, setIsSubmitting, isSubmitting],
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
        <ButtonComponent loading={!captchaReady || isSubmitting} fullWidth>
          Register
        </ButtonComponent>
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
