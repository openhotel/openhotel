import { useAdmin } from "shared/hooks";
import React from "react";
//@ts-ignore
import styles from "./users.module.scss";
import { cn, getCensoredEmail } from "shared/utils";

export const UsersComponent = () => {
  const { users } = useAdmin();

  return (
    <div className={styles.users}>
      <h3>Users ({users.length})</h3>
      <div className={styles.list}>
        {users.map((user) => (
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
  );
};
