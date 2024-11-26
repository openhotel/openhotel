import React, { FormEvent, useCallback, useState } from "react";
import {
  CaptchaComponent,
  LinkComponent,
  RedirectComponent,
} from "shared/components";
import { useAccount } from "shared/hooks";
import styles from "./register.module.scss";
import { useNavigate } from "react-router-dom";

export const RegisterComponent: React.FC = () => {
  const [submittedAt, setSubmittedAt] = useState<number>();
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
        .catch(() => {
          setSubmittedAt(performance.now());
        });
    },
    [captchaId, navigate],
  );

  if (isLogged) return <RedirectComponent to="/" />;

  return (
    <div>
      <form className={styles.form} onSubmit={onSubmit}>
        <input name="email" placeholder="email" />
        <input name="username" placeholder="username" />
        <input name="password" placeholder="password" type="password" />
        <input
          name="rePassword"
          placeholder="Repeat password"
          type="password"
        />
        <CaptchaComponent submittedAt={submittedAt} onResolve={setCaptchaId} />
        <button type="submit">Register</button>
      </form>
      <LinkComponent to="/login">/login</LinkComponent>
    </div>
  );
};
