import React, { FormEvent, useCallback, useEffect, useState } from "react";
import { useOTP, useQR } from "shared/hooks";
//@ts-ignore
import styles from "./otp.module.scss";

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
            <span>
              Use an app like Google Authenticator and scan the QR to verify the
              2FA
            </span>
            <input placeholder="XXXXXX" name="token" maxLength={6} />
            <button>Verify</button>
          </form>
        ) : (
          <div>
            2FA is active <button onClick={onDeleteOTP}>Remove 2FA</button>
          </div>
        ))}
    </div>
  );
};
