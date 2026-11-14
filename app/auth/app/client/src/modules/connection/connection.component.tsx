import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RedirectComponent } from "shared/components";
import { useAccount, useConnection, useHotel } from "shared/hooks";
import { PartialConnection } from "shared/types";
import { arraysMatch, getLoginRedirect } from "shared/utils";
import { ButtonComponent } from "@openhotel/web-components";

export const ConnectionComponent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { isLogged } = useAccount();

  const { add, get } = useConnection();
  const { get: getHotel } = useHotel();

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
  };

  const onAddHost = useCallback(() => {
    add(hotelId, integrationId, state, scopes).then(
      ({ data: { redirectUrl } }) => {
        redirectTo(redirectUrl);
      },
    );
  }, [add, hotelId, integrationId, state, scopes, redirectTo]);

  if (!state || !hotelId || !integrationId) return <RedirectComponent to="/" />;

  useEffect(() => {
    if (!isLogged || !hotelId || !integrationId) return;

    getHotel(hotelId, integrationId)
      .then((connection) => {
        setConnection(connection);
      })
      .catch(() => navigate("/"));
    get(hotelId, integrationId)
      .then((connection) => {
        if (arraysMatch(connection.scopes, scopes)) return onAddHost();
      })
      .catch(({ status }) => {
        if (status === 403) navigate("/");
      });
  }, [setConnection, getHotel, get, hotelId, integrationId, isLogged]);

  if (isLogged === false)
    return (
      <RedirectComponent
        to={getLoginRedirect({ type: "integration", hotelId, integrationId })}
      />
    );
  if (isLogged === null || connection === undefined)
    return <div>loading...</div>;
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
