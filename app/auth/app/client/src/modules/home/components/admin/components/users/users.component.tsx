import { useAdmin } from "shared/hooks";
import React from "react";
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
        rowFunc={($row, columns) => {
          return (
            <tr
              key={$row.id + "row"}
              className={cn(styles.row, {
                [styles.admin]: $row.admin,
              })}
            >
              {columns.map(($column) => {
                const title = $row[$column.key];
                let value = title;

                if ($column.key === "email") value = getCensoredEmail(title);
                if ($column.key === "accountId")
                  value = value.substring(0, 12) + "...";

                return (
                  <td title={title} key={$row.id + $column.key + "row-column"}>
                    {value}
                  </td>
                );
              })}
            </tr>
          );
        }}
        data={users.map((user) => {
          const expireAt = dayjs(user.createdAt).add(1, "day");
          const remainingMinutes = expireAt.diff(today, "minutes");

          return {
            ...user,
            otp: user.otp ? "✅" : "❌",
            verified: user.verified
              ? "✅"
              : `⏳ ${Math.floor(remainingMinutes / 60)} hours ${remainingMinutes % 60} minutes`,
            createdAt: dayjs(user.createdAt).format("YYYY/MM/DD HH:mm:ss"),
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
