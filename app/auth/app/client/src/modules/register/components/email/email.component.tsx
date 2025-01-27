import React, { useState } from "react";
import { EMAIL_REGEX } from "shared/consts";
import { InputComponent } from "@oh/components";

//@ts-ignore
import styles from "./email.module.scss";

export const EmailComponent: React.FC = () => {
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
        <label key="error-invalid" className={styles.error}>
          Invalid email
        </label>
      ) : null}
    </>
  );
};
