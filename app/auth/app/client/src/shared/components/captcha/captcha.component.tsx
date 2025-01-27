import React, { useCallback, useEffect, useState } from "react";
import { CAPTCHA_ID, CAPTCHA_URL } from "shared/consts";

//@ts-ignore
import styles from "./captcha.module.scss";

type Props = {
  submittedAt: number;
  onResolve: (sessionId: string) => void;
};

export const CaptchaComponent: React.FC<Props> = ({
  submittedAt,
  onResolve,
}) => {
  const [sessionId, setSessionId] = useState<string>("");
  const [captchaImage, setCaptchaImage] = useState<string>("");
  const [isDone, setIsDone] = useState<boolean>(false);

  const $refreshCaptcha = useCallback(
    () =>
      fetch(`${CAPTCHA_URL}/v1/captcha?id=${CAPTCHA_ID}`)
        .then((data) => data.json())
        .then(({ sessionId, image }) => {
          setSessionId(sessionId);
          setCaptchaImage(image);
        }),
    [setSessionId, setCaptchaImage],
  );

  useEffect(() => {
    $refreshCaptcha();
    setIsDone(false);
  }, [setCaptchaImage, setIsDone, submittedAt]);

  const onClickCaptcha = useCallback(
    (event) => {
      if (isDone) return;
      const clientRect = event.target.getBoundingClientRect();
      const point = {
        x: Math.round(event.clientX - clientRect.left),
        y: Math.round(event.clientY - clientRect.top),
      };

      const headers = new Headers();
      headers.append("Content-Type", "application/json");

      fetch(`${CAPTCHA_URL}/v1/captcha/response`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          data: {
            point,
          },
          sessionId,
          id: CAPTCHA_ID,
        }),
      })
        .then((data) => data.json())
        .then((data) => {
          if (data === 200) {
            setIsDone(true);
            onResolve(sessionId);
            return;
          }
          $refreshCaptcha();
        });
    },
    [sessionId, isDone],
  );

  if (!captchaImage || isDone) return <div />;

  return (
    <div className={styles.captcha}>
      <label className={styles.captcha_label}>Captcha</label>
      <img
        className={styles.captcha_image}
        src={captchaImage}
        alt="captcha"
        onClick={onClickCaptcha}
      />
    </div>
  );
};
