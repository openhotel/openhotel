import React, { useCallback, useEffect, useState } from "react";
import { Connection } from "shared/types";
//@ts-ignore
import styles from "./connections.module.scss";
import { useConnection } from "shared/hooks";
import { ButtonComponent } from "@oh/components";

type Props = {} & React.HTMLProps<HTMLDivElement>;

export const ConnectionsComponent: React.FC<Props> = () => {
  const { remove, getList } = useConnection();

  const [hosts, setHosts] = useState<Connection[]>([]);

  const $reload = useCallback(() => getList().then(setHosts), []);

  useEffect(() => {
    $reload();
  }, []);

  const onRemoveHost = useCallback(
    (host: Connection) => async () => {
      await remove(host.hostname);
      $reload();
    },
    [],
  );

  return (
    <div>
      <h2>Connections</h2>
      <span>
        Servers can only access your account scopes if the connection is ACTIVE
      </span>
      <div className={styles.list}>
        {hosts.map((connection) => (
          <div key={connection.hostname} className={styles.hotel}>
            <b>
              {connection.hostname} {connection.isActive ? "(ACTIVE)" : ""}
            </b>
            <p>accounts: {connection.accounts}</p>
            {connection.scopes.length ? (
              <>
                <label>scopes:</label>
                {connection.scopes.map((scope) => (
                  <div key={scope}>- {scope}</div>
                ))}
              </>
            ) : null}
            <p>
              <ButtonComponent onClick={onRemoveHost(connection)}>
                delete
              </ButtonComponent>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
