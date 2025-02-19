import { useAdmin } from "shared/hooks";
import React, { FormEvent, useCallback, useEffect, useState } from "react";
//@ts-ignore
import styles from "./third-party.module.scss";
import { ButtonComponent, InputComponent } from "@oh/components";

export const AdminThirdPartyComponent = () => {
  const { thirdParty, addThirdParty, removeThirdParty, fetchThirdParty } =
    useAdmin();

  const [lastThirdPartyToken, setLastThirdPartyToken] = useState<string>(null);

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const data = new FormData(event.target as unknown as HTMLFormElement);
      const url = data.get("url") as string;

      if (!url) return;

      const rawToken = await addThirdParty(url);
      setLastThirdPartyToken(rawToken);
    },
    [setLastThirdPartyToken],
  );

  const onDelete = useCallback(
    (id: string) => async () => removeThirdParty(id),
    [removeThirdParty],
  );

  useEffect(() => {
    fetchThirdParty();
  }, [fetchThirdParty]);

  return (
    <div className={styles.tokens}>
      <h2>Third Party</h2>
      <div className={styles.list}>
        {thirdParty.map((token, index) => (
          <div className={styles.item} key={token.id}>
            <label>{token.url}</label>
            <label>{token.id}</label>
            {lastThirdPartyToken && index === thirdParty.length - 1 ? (
              <label>{lastThirdPartyToken}</label>
            ) : null}
            <ButtonComponent onClick={onDelete(token.id)}>
              delete
            </ButtonComponent>
          </div>
        ))}
        <form className={styles.item} onSubmit={onSubmit}>
          <InputComponent placeholder="url" name="url" />
          <ButtonComponent>Add</ButtonComponent>
        </form>
      </div>
    </div>
  );
};
