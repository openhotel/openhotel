import React, { FormEvent, useCallback, useEffect, useState } from "react";
import { useAdmin, useApi } from "shared/hooks";
import { Account } from "shared/types";

export const OnetComponent: React.FC = () => {
  const { onet } = useAdmin();

  const [key, setKey] = useState<string>("");

  const onSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.target as unknown as HTMLFormElement);
    const url = data.get("url") as string;

    if (!url) return;

    onet.generateKey(url).then(({ data }) => setKey(data?.key));
  }, []);

  return (
    <div>
      <h1>Onet</h1>
      <form onSubmit={onSubmit}>
        <input name="url" placeholder="url" />
        <button>generate key</button>
        <label>{key}</label>
      </form>
    </div>
  );
};
