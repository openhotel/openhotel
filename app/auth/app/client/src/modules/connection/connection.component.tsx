import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RedirectComponent } from "shared/components";
import { useConnection, useHotel, useRedirect } from "shared/hooks";
import { PartialConnection } from "shared/types";
import { arraysMatch } from "shared/utils";
import { ButtonComponent } from "@oh/components";

export const ConnectionComponent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { add, get } = useConnection();
  const { get: getHotel } = useHotel();
  const { set: setRedirect } = useRedirect();

  const [connection, setConnection] = useState<PartialConnection | null>(
    undefined,
  );

  const state = searchParams.get("state");
  const hotelId = searchParams.get("hotelId");
  const integrationId = searchParams.get("integrationId");
  const scopes = searchParams.get("scopes")?.split(",") || [];
  const meta = searchParams.get("meta");

  const redirectTo = (redirectUrl: string) => {
    const composedRedirectUrl = new URL(redirectUrl);
    if (meta) composedRedirectUrl.searchParams.append("meta", meta);
    window.location.replace(composedRedirectUrl);

    setRedirect(redirectUrl);
  };

  const onAddHost = useCallback(() => {
    add(hotelId, integrationId, state, scopes).then(
      ({ data: { redirectUrl } }) => {
        redirectTo(redirectUrl);
      },
    );
  }, [add, hotelId, integrationId, state, scopes]);

  if (!state || !hotelId || !integrationId) return <RedirectComponent to="/" />;

  useEffect(() => {
    if (!hotelId || !integrationId) return;

    getHotel(hotelId, integrationId)
      .then((connection) => {
        setConnection(connection);
      })
      .catch(() => navigate("/"));
    get(hotelId, integrationId)
      .then((connection) => {
        if (arraysMatch(connection.scopes, scopes)) return onAddHost();
        setRedirect(connection.redirectUrl);
      })
      .catch(({ status }) => {
        if (status === 403) navigate("/");
      });
  }, [setConnection, getHotel, get, hotelId, integrationId]);

  if (connection === undefined) return <div>loading...</div>;
  if (connection === null) return <RedirectComponent to="/" />;

  return (
    <div>
      <label>connection</label>
      <hr />
      <b>
        {connection?.name} ({connection.type})
      </b>{" "}
      <i>by {connection.owner}</i>
      <p>{connection.redirectUrl}</p>
      <p>{connection.accounts} accounts already joined!</p>
      <p>{scopes.join(", ")}</p>
      <ButtonComponent onClick={onAddHost}>Continue...</ButtonComponent>
    </div>
  );
};
