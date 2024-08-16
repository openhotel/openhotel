import React, { FormEvent, useCallback, useState } from "react";
import { CaptchaComponent, LinkComponent } from "shared/components";
import { useApi } from "shared/hooks";
import styles from "./login.module.scss";
import { redirectToFallbackRedirectUrl } from "shared/utils/urls.utils";

export const LoginComponent: React.FC = () => {
  const [submittedAt, setSubmittedAt] = useState<number>();
  const [captchaId, setCaptchaId] = useState<string>();

  const { login, getTicketId } = useApi();

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const data = new FormData(event.target as unknown as HTMLFormElement);
      const email = data.get("email") as string;
      const password = data.get("password") as string;

      login(email, password, captchaId)
        .then(({ redirectUrl }) => {
          window.location.href = redirectUrl;
        })
        .catch(({ status }) => {
          setSubmittedAt(performance.now());
        });
    },
    [captchaId],
  );

  if (!getTicketId()) return redirectToFallbackRedirectUrl();

  return (
    <div>
      <form className={styles.form} onSubmit={onSubmit}>
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" type="password" />
        <CaptchaComponent submittedAt={submittedAt} onResolve={setCaptchaId} />
        <button type="submit">Login</button>
      </form>
      <LinkComponent to="/register">/register</LinkComponent>
    </div>
  );
};
