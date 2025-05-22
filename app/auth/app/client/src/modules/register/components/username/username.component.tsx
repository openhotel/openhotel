import React, { useState } from "react";
import {
  USERNAME_MAX_LEN,
  USERNAME_MIN_LEN,
  USERNAME_REGEX,
} from "shared/consts";
import { InputComponent } from "@openhotel/web-components";

//@ts-ignore
import styles from "./username.module.scss";

export const UsernameComponent: React.FC = () => {
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

    setInvalidChars(!new RegExp(USERNAME_REGEX).test(username));
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
        <label key="error-short" className={styles.error}>
          Username is too short
        </label>
      ) : null}

      {tooLong ? (
        <label key="error-long" className={styles.error}>
          Username is too long
        </label>
      ) : null}

      {invalidChars ? (
        <label key="error-invalid" className={styles.error}>
          Username contains invalid characters
        </label>
      ) : null}
    </>
  );
};
