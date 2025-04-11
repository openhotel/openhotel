import { useAdmin } from "shared/hooks";
import React, { FormEvent, useCallback, useEffect, useState } from "react";
//@ts-ignore
import styles from "./tokens.module.scss";
import { ButtonComponent, InputComponent } from "@openhotel/components";

export const AdminTokensComponent = () => {
  const { tokens, addToken, removeToken, fetchTokens } = useAdmin();

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

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  return (
    <div className={styles.tokens}>
      <h2>Tokens</h2>
      <div className={styles.list}>
        {tokens.map((token, index) => (
          <div className={styles.item} key={token.id}>
            <label>{token.label}</label>
            <label>{token.id}</label>
            {lastToken && index === tokens.length - 1 ? (
              <label>{lastToken}</label>
            ) : null}
            <ButtonComponent onClick={onDelete(token.id)}>
              delete
            </ButtonComponent>
          </div>
        ))}
        <form className={styles.item} onSubmit={onSubmit}>
          <InputComponent placeholder="label" name="label" />
          <ButtonComponent>Add</ButtonComponent>
        </form>
      </div>
    </div>
  );
};
