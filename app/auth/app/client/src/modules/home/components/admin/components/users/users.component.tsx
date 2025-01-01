import { useAdmin } from "shared/hooks";
import React, { useMemo } from "react";
import { cn, getCensoredEmail } from "shared/utils";
import dayjs from "dayjs";

//@ts-ignore
import styles from "./users.module.scss";
import { TableComponent } from "@oh/components";

export const UsersComponent = () => {
  const { users } = useAdmin();

  const today = dayjs(Date.now());

  return (
    <div className={styles.users}>
      <TableComponent
        title="Users"
        searchable={true}
        pageRows={20}
        data={users.map((user) => {
          const expireAt = dayjs(user.createdAt).add(1, "day");
          const remainingMinutes = expireAt.diff(today, "minutes");

          return {
            ...user,
            admin: user.admin ? "✔️" : "❌",
            otp: user.otp ? "✔️" : "❌",
            verified: user.verified
              ? "✔️"
              : `❌ ${Math.floor(remainingMinutes / 60)} hours ${remainingMinutes % 60} minutes`,
          };
        })}
        columns={[
          {
            key: "accountId",
            label: "Account Id",
          },
          {
            sortable: true,
            key: "createdAt",
            label: "Created At",
          },
          {
            key: "email",
            label: "Email",
          },
          {
            sortable: true,
            key: "username",
            label: "Username",
          },
          {
            sortable: true,
            key: "admin",
            label: "Admin",
          },
          {
            sortable: true,
            key: "otp",
            label: "2FA",
          },
          {
            sortable: true,
            key: "verified",
            label: "Verified",
          },
        ]}
      />
    </div>
  );
};
