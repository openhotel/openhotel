import React, { useCallback, useEffect, useMemo, useState } from "react";
//@ts-ignore
import styles from "./sessions.module.scss";
import { useAccount } from "shared/hooks";
import { cn } from "shared/utils";
import {
  ButtonComponent,
  CrossIconComponent,
  FormComponent,
  InputComponent,
  TableComponent,
} from "@openhotel/components";
import { AccountSession } from "shared/types";

import dayjs from "dayjs";

type Props = {} & React.HTMLProps<HTMLDivElement>;

export const SessionsComponent: React.FC<Props> = () => {
  const { getTokens, getTokenId, removeToken } = useAccount();

  const [sessions, setSessions] = useState<AccountSession[]>([]);
  const [selectedSession, setSelectedSessions] = useState<AccountSession>(null);

  useEffect(() => {
    getTokens().then(setSessions);
  }, [getTokens]);

  const $revokeSession = useCallback(async () => {
    await removeToken(selectedSession.tokenId);
    setSelectedSessions(null);
    getTokens().then(setSessions);
  }, [
    selectedSession,
    setSelectedSessions,
    removeToken,
    getTokens,
    setSessions,
  ]);

  const currentTokenId = useMemo(() => getTokenId(), [getTokenId]);

  return (
    <div className={styles.sessions}>
      <h2>Sessions</h2>
      {selectedSession ? (
        <FormComponent className={styles.selectedForm}>
          <div className={styles.header}>
            <label>Selected session</label>
            <CrossIconComponent
              className={styles.icon}
              onClick={() => setSelectedSessions(null)}
            />
          </div>
          <div className={styles.formRow}>
            <InputComponent
              disabled
              placeholder="Operating System"
              value={selectedSession.os}
            />
            <InputComponent
              disabled
              placeholder="Browser"
              value={selectedSession.browser}
            />
          </div>
          <div className={styles.formRow}>
            <InputComponent
              disabled
              placeholder="Ip"
              value={selectedSession.ip}
            />
            <InputComponent
              disabled
              placeholder="Last used"
              value={dayjs(selectedSession.updatedAt).fromNow()}
            />
          </div>
          <div className={styles.formRow}>
            {currentTokenId === selectedSession.tokenId ? null : (
              <ButtonComponent color="grey" onClick={$revokeSession}>
                Revoke session
              </ButtonComponent>
            )}
          </div>
        </FormComponent>
      ) : null}

      <TableComponent
        title="Sessions"
        searchable={true}
        pageRows={20}
        rowFunc={($row, columns) => {
          return (
            <tr
              key={$row.tokenId + "row"}
              className={cn(styles.row, {
                [styles.selected]: selectedSession?.tokenId === $row.tokenId,
              })}
              onClick={() => setSelectedSessions($row)}
            >
              {columns.map(($column) => {
                const value = $row[$column.key];
                return (
                  <td title={value} key={$row.id + $column.key + "row-column"}>
                    {value}
                  </td>
                );
              })}
            </tr>
          );
        }}
        data={sessions.map((session) => {
          return {
            ...session,
            current:
              getTokenId() === session.tokenId ? "Current session" : null,
            ip: session.ip,
            lastUsed: dayjs(session.updatedAt).fromNow(),
          };
        })}
        columns={[
          {
            key: "current",
            label: "-",
          },
          {
            key: "os",
            label: "Operating System",
          },
          {
            key: "browser",
            label: "Browser",
          },
          {
            key: "lastUsed",
            label: "Last used",
          },
        ]}
      />
    </div>
  );
};
