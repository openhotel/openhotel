import React, { useCallback, useEffect, useState } from "react";
import styles from "./captcha.module.scss";
import { useCaptcha } from "shared/hooks/useCaptcha";

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
  const [captchaConfig, setCaptchaConfig] = useState<{
    enabled: boolean;
    url: string;
    id: string;
  } | null>(null);

  const { get: getCaptcha } = useCaptcha();

  useEffect(() => {
    getCaptcha()
      .then((response) => {
        setCaptchaConfig({
          enabled: response?.enabled ?? false,
          url: response?.url ?? "",
          id: response?.id ?? "",
        });
      })
      .catch(() => {
        setCaptchaConfig({ enabled: false, url: "", id: "" });
      });
  }, [getCaptcha]);

  const $refreshCaptcha = useCallback(() => {
    if (!captchaConfig?.enabled) return;

    fetch(`${captchaConfig.url}/v1/captcha?id=${captchaConfig.id}`)
      .then((data) => data.json())
      .then(({ sessionId, image }) => {
        setSessionId(sessionId);
        setCaptchaImage(image);
      });
  }, [captchaConfig]);

  useEffect(() => {
    if (captchaConfig?.enabled) {
      $refreshCaptcha();
      setIsDone(false);
    }
  }, [submittedAt, captchaConfig]);

  const onClickCaptcha = useCallback(
    (event) => {
      if (isDone || !captchaConfig?.enabled) return;
      const clientRect = event.target.getBoundingClientRect();
      const point = {
        x: Math.round(event.clientX - clientRect.left),
        y: Math.round(event.clientY - clientRect.top),
      };

      fetch(`${captchaConfig.url}/v1/captcha/response`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: { point },
          sessionId,
          id: captchaConfig.id,
        }),
      })
        .then((data) => data.json())
        .then((response) => {
          if (response === 200) {
            setIsDone(true);
            onResolve(sessionId);
            return;
          }
          $refreshCaptcha();
        });
    },
    [sessionId, isDone, captchaConfig],
  );

  if (!captchaConfig?.enabled || !captchaImage || isDone) return null;

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
