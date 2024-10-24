import React, { useEffect, useState } from "react";
import { useApi } from "shared/hooks";
import { RequestMethod } from "@oh/components";

export const TestComponent = () => {
  const [version, setVersion] = useState<string>(null);
  const [clientUrl, setClientUrl] = useState<string>(null);
  const [authUrl, setAuthUrl] = useState<string>(null);

  const { fetch } = useApi();

  useEffect(() => {
    fetch(RequestMethod.GET, "/version").then(({ version }) =>
      setVersion(version),
    );
    fetch(RequestMethod.GET, "/config").then(({ client, auth }: any) => {
      setClientUrl(client.url);
      setAuthUrl(auth.url);
    });
  }, []);

  const onClickPlay = () => {
    const width = 1280;
    const height = 720;

    const left = ((screen as any)?.left ?? 0) + screen.width / 2 - width / 2;
    const top = ((screen as any)?.top || 0) + screen.height / 2 - height / 2;

    window.open(
      clientUrl,
      "Open Hotel Client",
      `width=${width},height=${height},top=${top},left=${left}`,
    );
  };

  return (
    <div>
      <h3>Open Hotel (wip)</h3>
      <br />
      <br />
      {version}
      <br />
      <button onClick={onClickPlay}>play!</button>
      <br />
      <a href={`${authUrl}/account`}>account</a>
    </div>
  );
};
