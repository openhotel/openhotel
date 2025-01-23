import React, { FormEvent, useCallback, useEffect, useState } from "react";
import { useOTP, useQR } from "shared/hooks";
//@ts-ignore
import styles from "./otp.module.scss";
import { ButtonComponent, InputComponent } from "@oh/components";

export const OtpComponent: React.FC = () => {
  const { get, verify, remove } = useOTP();
  const { getQR } = useQR();

  const [isLoaded, setLoaded] = useState<boolean>(false);
  const [uri, setUri] = useState<string>(null);

  const $reload = useCallback(
    () =>
      get()
        .then(async ({ data }) => {
          setUri(await getQR(data.uri));
          setLoaded(true);
        })
        .catch(() => {
          setLoaded(true);
        }),
    [get, setUri, setLoaded, getQR],
  );

  useEffect(() => {
    $reload();
  }, []);

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const data = new FormData(event.target as unknown as HTMLFormElement);
      const token = data.get("token") as string;

      if (!token || token.length !== 6) return;

      const isVerified = await verify(token);
      if (isVerified) setUri(null);
    },
    [verify, setUri],
  );

  const onDeleteOTP = useCallback(async () => {
    setLoaded(false);
    await remove();
    $reload();
  }, [$reload]);

  return (
    <div>
      <h3>2FA</h3>
      {isLoaded &&
        (uri ? (
          <form className={styles.form} onSubmit={onSubmit}>
            <img className={styles.qr} src={uri} onClick={$reload} />
            <div className={styles.otpControls}>
              <span>
                Use an app like Google Authenticator, scan the QR and to verify
                the 2FA code.
              </span>
              <InputComponent placeholder="XXXXXX" name="token" maxLength={6} />
              <ButtonComponent>Verify</ButtonComponent>
            </div>
          </form>
        ) : (
          <div>
            2FA is active{" "}
            <ButtonComponent onClick={onDeleteOTP}>Remove 2FA</ButtonComponent>
          </div>
        ))}
    </div>
  );
};
