import React, { useCallback, useEffect, useState } from "react";

type Props = {
  submittedAt: number;
  onResolve: (sessionId: string) => void;
};

const CAPTCHA_ID = `hwoFA5ORzPAYkHyCNElRU0F3WXAD0ZN9`;

export const CaptchaComponent: React.FC<Props> = ({
  submittedAt,
  onResolve,
}) => {
  const [sessionId, setSessionId] = useState<string>("");
  const [captchaImage, setCaptchaImage] = useState<string>("");
  const [isDone, setIsDone] = useState<boolean>(false);

  const $refreshCaptcha = useCallback(
    () =>
      fetch(`https://captcha.openhotel.club/v1/captcha?id=${CAPTCHA_ID}`)
        .then((data) => data.json())
        .then(({ sessionId, image, question }) => {
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

      fetch("https://captcha.openhotel.club/v1/captcha/response", {
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
    <img
      style={{
        backgroundColor: "#ffffff",
        cursor: "pointer",
        width: "fit-content",
      }}
      src={captchaImage}
      alt="captcha"
      onClick={onClickCaptcha}
    />
  );
};
