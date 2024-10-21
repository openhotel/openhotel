import React, { FormEvent, useCallback, useEffect, useState } from "react";
import { useAdmin, useApi } from "shared/hooks";

export const TokensComponent: React.FC = () => {
  const { tokens } = useAdmin();

  const [list, setList] = useState<string[]>([]);
  const [data, setData] = useState<
    Record<string, { key: string; token: string }>
  >({});

  useEffect(() => {
    tokens.getList().then(({ data: { list } }) => setList(list));
  }, []);

  const onSubmit = useCallback(
    (service: string) => async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const data = new FormData(event.target as unknown as HTMLFormElement);
      const url = data.get("url") as string;

      if (!url) return;

      tokens.generate(service, url).then(({ data }) =>
        setData((currentData) => ({
          ...currentData,
          [service]: data,
        })),
      );
    },
    [],
  );

  return (
    <div>
      <h1>Tokens</h1>
      <div>
        {list?.map((service) => (
          <form
            key={service}
            onSubmit={onSubmit(service)}
            style={{ marginBottom: "1rem" }}
          >
            <input
              name="url"
              placeholder={service}
              style={{ marginRight: ".5rem" }}
            />
            <button>generate '{service}' key</button>
            {data[service] ? (
              <>
                <br />
                <label>key: {data[service]?.key}</label>
                <br />
                <label>token: {data[service]?.token}</label>
              </>
            ) : null}
          </form>
        ))}
      </div>
    </div>
  );
};
