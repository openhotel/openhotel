import { useAdmin } from "shared/hooks";
import React from "react";
//@ts-ignore
import styles from "./users.module.scss";
import { getCensoredEmail } from "shared/utils";

export const UsersComponent = () => {
  const { users } = useAdmin();

  return (
    <div className={styles.users}>
      <h3>Users</h3>
      <div className={styles.list}>
        {users.map((user) => (
          <div className={styles.item} key={user.accountId}>
            <label>{user.username}</label>
            <label title={user.email}>{getCensoredEmail(user.email)}</label>
            <label>{user.admin ? "ADMIN" : null}</label>
            <label>{user.otp ? "2FA" : null}</label>
          </div>
        ))}
      </div>
    </div>
  );
};
