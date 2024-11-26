import { useAdmin } from "shared/hooks";
import React, { FormEvent, useCallback, useState } from "react";
//@ts-ignore
import styles from "./tokens.module.scss";

export const TokensComponent = () => {
  const { tokens, addToken, removeToken } = useAdmin();

  const [lastToken, setLastToken] = useState<string>(null);

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const data = new FormData(event.target as unknown as HTMLFormElement);
      const label = data.get("label") as string;

      if (!label) return;

      const rawToken = await addToken(label);
      setLastToken(rawToken);
    },
    [setLastToken],
  );

  const onDelete = useCallback(
    (id: string) => async () => removeToken(id),
    [removeToken],
  );

  return (
    <div className={styles.tokens}>
      <h3>Tokens</h3>
      <div className={styles.list}>
        {tokens.map((token, index) => (
          <div className={styles.item} key={token.id}>
            <label>{token.label}</label>
            <label>{token.id}</label>
            {lastToken && index === tokens.length - 1 ? (
              <label>{lastToken}</label>
            ) : null}
            <button onClick={onDelete(token.id)}>delete</button>
          </div>
        ))}
        <form className={styles.item} onSubmit={onSubmit}>
          <input placeholder="label" name="label" />
          <button>Add</button>
        </form>
      </div>
    </div>
  );
};
