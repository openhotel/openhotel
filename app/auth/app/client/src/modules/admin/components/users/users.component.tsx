import { useAdmin } from "shared/hooks";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { cn, getCensoredEmail } from "shared/utils";
import dayjs from "dayjs";
import {
  TableComponent,
  FormComponent,
  InputComponent,
  CrossIconComponent,
  ButtonComponent,
  SelectorComponent,
  ConfirmationModalComponent,
} from "@oh/components";
import { User } from "shared/types";
import { EMAIL_REGEX, USERNAME_REGEX } from "shared/consts";

//@ts-ignore
import styles from "./users.module.scss";
import { UserFormComponent } from "modules/admin/components/users/user-form";

export const AdminUsersComponent = () => {
  const { users, fetchUsers } = useAdmin();

  const [selectedUser, setSelectedUser] = useState<User>();

  const today = dayjs(Date.now());

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div>
      <h2>Users</h2>
      <div className={styles.users}>
        {selectedUser ? (
          <UserFormComponent user={selectedUser} setUser={setSelectedUser} />
        ) : null}
        <TableComponent
          title="Users"
          searchable={true}
          pageRows={20}
          rowFunc={($row, columns) => {
            return (
              <tr
                key={$row.accountId + "row"}
                className={cn(styles.row, {
                  [styles.admin]: $row.admin,
                  [styles.selected]: selectedUser?.accountId === $row.accountId,
                })}
                onClick={() => setSelectedUser($row)}
              >
                {columns.map(($column) => {
                  const title = $row[$column.key];
                  let value = title;

                  if ($column.key === "email") value = getCensoredEmail(title);
                  if ($column.key === "accountId")
                    value = value.substring(0, 12) + "...";

                  return (
                    <td
                      title={title}
                      key={$row.id + $column.key + "row-column"}
                    >
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
              githubLogin: user.githubLogin,
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
              key: "githubLogin",
              label: "github",
            },
            {
              sortable: true,
              key: "verified",
              label: "Verified",
            },
          ]}
        />
      </div>
    </div>
  );
};
