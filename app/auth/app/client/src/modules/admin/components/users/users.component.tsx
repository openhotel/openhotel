import { useAdmin } from "shared/hooks";
import React, { useCallback, useMemo, useState } from "react";
import { cn, getCensoredEmail } from "shared/utils";
import dayjs from "dayjs";
import {
  TableComponent,
  FormComponent,
  InputComponent,
  CrossIconComponent,
  ButtonComponent,
  SelectorComponent,
} from "@oh/components";
import { User } from "shared/types";
import { EMAIL_REGEX, USERNAME_REGEX } from "shared/consts";

//@ts-ignore
import styles from "./users.module.scss";

export const AdminUsersComponent = () => {
  const { users, updateUser, refresh } = useAdmin();

  const [selectedUser, setSelectedUser] = useState<User>();

  const today = dayjs(Date.now());

  const onSubmitUpdateUser = useCallback(
    async ({ username, email, createdAt, admin }: any) => {
      if (
        !new RegExp(USERNAME_REGEX).test(username) ||
        !new RegExp(EMAIL_REGEX).test(email)
      )
        return;

      const user: User = {
        accountId: selectedUser.accountId,
        username,
        email,
        createdAt: dayjs(createdAt).valueOf(),
        admin: selectedUser.admin,
      };
      console.log(user);

      await updateUser(user);
      refresh();
    },
    [selectedUser, updateUser],
  );

  const adminOptions = useMemo(
    () => ["true", "false"].map((key) => ({ key, value: key })),
    [],
  );
  const selectedAdminOption = useMemo(
    () =>
      adminOptions.find(({ key }) =>
        selectedUser?.admin ? "true" : "false" === key,
      ),
    [selectedUser, adminOptions],
  );

  return (
    <div>
      <h2>Users</h2>
      <div className={styles.users}>
        {selectedUser ? (
          <FormComponent
            className={styles.selectedForm}
            onSubmit={onSubmitUpdateUser}
          >
            <div className={styles.header}>
              <label>Selected user</label>
              <CrossIconComponent
                className={styles.icon}
                onClick={() => setSelectedUser(null)}
              />
            </div>
            <label>{selectedUser.accountId}</label>
            <div className={styles.formRow}>
              <InputComponent
                name="username"
                placeholder="username"
                value={selectedUser.username}
                onChange={(event) =>
                  setSelectedUser((user) => ({
                    ...user,
                    username: event.target.value,
                  }))
                }
              />
              <InputComponent
                name="email"
                placeholder="email"
                value={selectedUser.email}
                onChange={(event) =>
                  setSelectedUser((user) => ({
                    ...user,
                    email: event.target.value,
                  }))
                }
              />
            </div>
            <div className={styles.formRow}>
              <InputComponent
                name="createdAt"
                placeholder="createdAt"
                value={selectedUser.createdAt}
                onChange={(event) =>
                  setSelectedUser((user) => ({
                    ...user,
                    createdAt: event.target.value,
                  }))
                }
              />
              <SelectorComponent
                name="admin"
                placeholder="admin"
                options={adminOptions}
                defaultOption={selectedAdminOption}
                onChange={(option) =>
                  setSelectedUser((user) => ({
                    ...user,
                    admin: option?.key === "true",
                  }))
                }
              />
            </div>
            <ButtonComponent>Update</ButtonComponent>
          </FormComponent>
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
    </div>
  );
};
