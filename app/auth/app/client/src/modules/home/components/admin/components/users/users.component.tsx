import { useAdmin } from "shared/hooks";
import React, { useMemo } from "react";
import { cn, getCensoredEmail } from "shared/utils";
import dayjs from "dayjs";

//@ts-ignore
import styles from "./users.module.scss";

export const UsersComponent = () => {
  const { users } = useAdmin();

  const verifiedUsers = useMemo(
    () => users.filter(($user) => $user.verified),
    [users],
  );
  const today = dayjs(Date.now());

  const temporalUsers = useMemo(
    () =>
      users
        .filter(($user) => !$user.verified)
        .map(($user) => {
          const expireAt = dayjs($user.createdAt).add(1, "day");
          const remainingMinutes = expireAt.diff(today, "minutes");

          return {
            ...$user,
            remainingTime: `${Math.floor(remainingMinutes / 60)} hours ${remainingMinutes % 60} minutes`,
          };
        }),
    [users, today],
  );

  return (
    <div className={styles.users}>
      <div>
        <h3>Users ({verifiedUsers.length})</h3>
        <div className={styles.list}>
          {verifiedUsers.map((user) => (
            <div
              className={cn(styles.item, {
                [styles.admin]: user.admin,
              })}
              key={user.accountId}
            >
              <label>{new Date(user.createdAt).toISOString()}</label>
              <label>{user.accountId}</label>
              <label>{user.username}</label>
              <label title={user.email}>{getCensoredEmail(user.email)}</label>
              <label>{user.otp ? "2FA" : null}</label>
              <label>{user.admin ? "ADMIN" : null}</label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3>Temp Users ({temporalUsers.length})</h3>
        <div className={styles.list}>
          {temporalUsers.map((user) => (
            <div className={styles.item} key={user.accountId}>
              <label>{new Date(user.createdAt).toISOString()}</label>
              <label>{user.accountId}</label>
              <label>{user.username}</label>
              <label title={user.email}>{getCensoredEmail(user.email)}</label>
              <div>{user.remainingTime} remaining</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
