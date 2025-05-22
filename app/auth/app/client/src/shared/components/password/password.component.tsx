import React, { useState } from "react";
import { PASSWORD_MIN_LEN } from "shared/consts";
import { InputComponent } from "@openhotel/web-components";
//@ts-ignore
import styles from "./password.module.scss";

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
        <label key="error-match" className={styles.error}>
          Passwords don't match
        </label>
      ) : null}

      {passTooShort ? (
        <label key="error-short" className={styles.error}>
          Password is too short
        </label>
      ) : null}
    </>
  );
};
