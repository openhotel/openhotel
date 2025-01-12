import React, { useCallback, useEffect, useState } from "react";
import { Connection } from "shared/types";
//@ts-ignore
import styles from "./connections.module.scss";
import { useConnection } from "shared/hooks";
import { ButtonComponent } from "@oh/components";

type Props = {} & React.HTMLProps<HTMLDivElement>;

export const ConnectionsComponent: React.FC<Props> = () => {
  const { remove, getList } = useConnection();

  const [connections, setConnections] = useState<Connection[]>([]);

  const $reload = useCallback(() => getList().then(setConnections), []);

  useEffect(() => {
    $reload();
  }, []);

  const onRemoveHost = useCallback(
    (hotelId: string, integrationId: string) => async () => {
      await remove(hotelId, integrationId);
      $reload();
    },
    [],
  );

  return (
    <div>
      <h2>Connections</h2>
      <div className={styles.list}>
        {connections.map((hotelConnection) => (
          <div key={hotelConnection.hotelId} className={styles.hotel}>
            <b>{hotelConnection.name}</b> <i>by {hotelConnection.owner}</i>
            <div>
              <hr />
              <div style={{ marginBottom: "1rem" }}>connections:</div>
              <div className={styles.sublist}>
                {hotelConnection.connections.map((connection) => (
                  <div
                    key={connection.integrationId}
                    className={styles.connection}
                  >
                    <b>
                      {connection.name}
                      {connection.active ? " (ACTIVE)" : null}
                    </b>
                    <label>{connection.active}</label>
                    <hr />

                    <div>scopes:</div>
                    {connection.scopes.map((scope) => (
                      <div key={scope}>- {scope}</div>
                    ))}

                    <div style={{ display: "flex", gap: "1rem" }}>
                      <a href={connection.redirectUrl}>
                        <ButtonComponent>Go!</ButtonComponent>
                      </a>
                      <ButtonComponent
                        style={{ backgroundColor: "gray" }}
                        onClick={onRemoveHost(
                          hotelConnection.hotelId,
                          connection.integrationId,
                        )}
                      >
                        delete
                      </ButtonComponent>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/*<p>accounts: {connection.accounts}</p>*/}
            {/*{connection.scopes.length ? (*/}
            {/*  <>*/}
            {/*    <label>scopes:</label>*/}
            {/*    {connection.scopes.map((scope) => (*/}
            {/*      <div key={scope}>- {scope}</div>*/}
            {/*    ))}*/}
            {/*  </>*/}
            {/*) : null}*/}
            <p></p>
          </div>
        ))}
      </div>
    </div>
  );
};
