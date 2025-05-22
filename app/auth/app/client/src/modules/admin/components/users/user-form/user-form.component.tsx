import React, { useCallback, useMemo } from "react";
import {
  ButtonComponent,
  ConfirmationModalComponent,
  CrossIconComponent,
  FormComponent,
  InputComponent,
  SelectorComponent,
  useModal,
} from "@openhotel/web-components";
import { EMAIL_REGEX, USERNAME_REGEX } from "shared/consts";
import { User } from "shared/types";
import dayjs from "dayjs";
import { useAdmin } from "shared/hooks";
//@ts-ignore
import styles from "./user-form.module.scss";

type Props = {
  user: User;

  setUser: (user: User) => void;
};

export const UserFormComponent: React.FC<Props> = ({ user, setUser }) => {
  const { updateUser, deleteUser, fetchUsers, resendVerificationUser } =
    useAdmin();

  const { open, close } = useModal();

  const onSubmitUpdateUser = useCallback(
    async ({ username, email, createdAt, admin }: any) => {
      if (
        !new RegExp(USERNAME_REGEX).test(username) ||
        !new RegExp(EMAIL_REGEX).test(email)
      )
        return;

      const $user: User = {
        accountId: user.accountId,
        username,
        email,
        createdAt: dayjs(createdAt).valueOf(),
        admin: user.admin,
        languages: user.languages,
      };

      await updateUser($user);
      fetchUsers();
    },
    [user, updateUser],
  );

  const onResendVerificationEmail = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      await resendVerificationUser(user.accountId);
    },
    [user, resendVerificationUser],
  );

  const adminOptions = useMemo(
    () => ["true", "false"].map((key) => ({ key, value: key })),
    [],
  );
  const selectedAdminOption = useMemo(
    () =>
      adminOptions.find(({ key }) => (user?.admin ? "true" : "false" === key)),
    [user, adminOptions],
  );
  const $onRemoveAccount = useCallback(async () => {
    await deleteUser(user);
    fetchUsers();
  }, [deleteUser, user]);

  return (
    <div className={styles.selectedForm}>
      <FormComponent onSubmit={onSubmitUpdateUser}>
        <div className={styles.header}>
          <label>Selected user</label>
          <CrossIconComponent
            className={styles.icon}
            onClick={() => setUser(null)}
          />
        </div>
        <label>{user.accountId}</label>
        <div className={styles.formRow}>
          <InputComponent
            name="username"
            placeholder="username"
            value={user.username}
            onChange={(event) =>
              setUser({
                ...user,
                username: event.target.value,
              })
            }
          />
          <InputComponent
            name="email"
            placeholder="email"
            value={user.email}
            onChange={(event) =>
              setUser({
                ...user,
                email: event.target.value,
              })
            }
          />
        </div>
        <div className={styles.formRow}>
          <InputComponent
            name="createdAt"
            placeholder="createdAt"
            value={user.createdAt}
            onChange={(event) =>
              setUser({
                ...user,
                createdAt: event.target.value,
              })
            }
          />
          <SelectorComponent
            name="admin"
            placeholder="admin"
            options={adminOptions}
            defaultOption={selectedAdminOption}
            onChange={(option) =>
              setUser({
                ...user,
                admin: option?.key === "true",
              })
            }
          />
        </div>
        <div className={styles.actions}>
          {user.admin ? null : (
            <ButtonComponent
              color="grey"
              onClick={() =>
                open({
                  children: (
                    <ConfirmationModalComponent
                      description={`Are you sure you want to delete ${user.username}'s account?`}
                      onClose={close}
                      onConfirm={$onRemoveAccount}
                    />
                  ),
                })
              }
            >
              Delete
            </ButtonComponent>
          )}
          {/*//@ts-ignore*/}
          {user.verified !== "✅" ? (
            <ButtonComponent color="yellow" onClick={onResendVerificationEmail}>
              Resend verification email
            </ButtonComponent>
          ) : null}
          <ButtonComponent>Update</ButtonComponent>
        </div>
      </FormComponent>
    </div>
  );
};
