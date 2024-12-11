import React, { FormEvent, useCallback, useState } from "react";
import {
  CaptchaComponent,
  LinkComponent,
  RedirectComponent,
} from "shared/components";
import { useAccount } from "shared/hooks";
import login_styles from "../login/login.module.scss";
import { useNavigate } from "react-router-dom";
import { ButtonComponent, InputComponent } from "@oh/components";
import {
  EMAIL_REGEX,
  PASSWORD_MIN_LEN,
  USERNAME_MAX_LEN,
  USERNAME_MIN_LEN,
  USERNAME_VALID_CHARS,
} from "../../shared/consts/account.consts";
import styles from "../login/login.module.scss";

export const RegisterComponent: React.FC = () => {
  const [submittedAt, setSubmittedAt] = useState<number>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [captchaId, setCaptchaId] = useState<string>();

  const { register, isLogged } = useAccount();
  let navigate = useNavigate();

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const data = new FormData(event.target as unknown as HTMLFormElement);
      const email = data.get("email") as string;
      const username = data.get("username") as string;
      const password = data.get("password") as string;
      const rePassword = data.get("rePassword") as string;

      register({ email, username, password, rePassword, captchaId })
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
    <div className={login_styles.wrapper}>
      <form className={login_styles.form} onSubmit={onSubmit}>
        <h1 className={login_styles.title}>Register</h1>
        <EmailComponent />
        <UsernameComponent />
        <PasswordComponent />
        <CaptchaComponent submittedAt={submittedAt} onResolve={setCaptchaId} />
        <ButtonComponent fullWidth>Register</ButtonComponent>
        {errorMessage ? (
          <label key="backend-error" className={login_styles.error}>
            {errorMessage}
          </label>
        ) : null}
      </form>
      <LinkComponent className={login_styles.link} to="/login">
        Already registered? Login here.
      </LinkComponent>
    </div>
  );
};

const EmailComponent: React.FC = () => {
  const [email, setEmail] = useState("");
  const [invalid, setInvalid] = useState(false);

  const check = () => {
    if (email === "") {
      setInvalid(false);
      return;
    }
    setInvalid(!new RegExp(EMAIL_REGEX).test(email));
  };

  return (
    <>
      <InputComponent
        name="email"
        placeholder="Email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
        onBlur={check}
      />

      {invalid ? (
        <label key="error-invalid" className={login_styles.error}>
          Invalid email
        </label>
      ) : null}
    </>
  );
};

const UsernameComponent: React.FC = () => {
  const [username, setUsername] = useState("");
  const [tooShort, setTooShort] = useState(false);
  const [invalidChars, setInvalidChars] = useState(false);
  const [tooLong, setTooLong] = useState(false);

  const check = () => {
    if (username === "") {
      setTooShort(false);
      setTooLong(false);
      setInvalidChars(false);
      return;
    }
    setTooShort(username.length < USERNAME_MIN_LEN);
    setTooLong(username.length > USERNAME_MAX_LEN);
    console.log(username, new RegExp(USERNAME_VALID_CHARS).test(username));
    setInvalidChars(!new RegExp(USERNAME_VALID_CHARS).test(username));
  };

  return (
    <>
      <InputComponent
        name="username"
        placeholder="Username"
        autoComplete="username"
        value={username}
        onChange={(e) => setUsername((e.target as HTMLInputElement).value)}
        onBlur={check}
      />

      {tooShort ? (
        <label key="error-short" className={login_styles.error}>
          Username is too short
        </label>
      ) : null}

      {tooLong ? (
        <label key="error-long" className={login_styles.error}>
          Username is too long
        </label>
      ) : null}

      {invalidChars ? (
        <label key="error-invalid" className={login_styles.error}>
          Username contains invalid characters
        </label>
      ) : null}
    </>
  );
};

export const PasswordComponent: React.FC = () => {
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [passMatch, setPassMatch] = useState(true);
  const [passTooShort, setPassTooShort] = useState(false);

  const check = () => {
    setPassMatch(pass1 === pass2 || pass2 === "");
    setPassTooShort(pass1 && pass1.length < PASSWORD_MIN_LEN);
  };

  return (
    <>
      <InputComponent
        name="password"
        placeholder="Password"
        type="password"
        autoComplete="new-password"
        maxLength={64}
        value={pass1}
        onChange={(e) => setPass1((e.target as HTMLInputElement).value)}
        onBlur={check}
      />
      <InputComponent
        name="rePassword"
        placeholder="Repeat password"
        type="password"
        maxLength={64}
        autoComplete="off"
        value={pass2}
        onChange={(e) => setPass2((e.target as HTMLInputElement).value)}
        onBlur={check}
      />

      {!passMatch ? (
        <label key="error-match" className={login_styles.error}>
          Passwords don't match
        </label>
      ) : null}

      {passTooShort ? (
        <label key="error-short" className={login_styles.error}>
          Password is too short
        </label>
      ) : null}
    </>
  );
};
