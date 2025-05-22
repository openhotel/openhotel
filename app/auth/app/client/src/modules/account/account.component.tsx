import { useUser } from "shared/hooks";
import React from "react";
import { getCensoredEmail } from "shared/utils";
import {
  GithubComponent,
  LanguagesComponent,
  OtpComponent,
} from "./components";
//@ts-ignore
import styles from "./account.module.scss";
import { ButtonComponent } from "@openhotel/web-components";
import { LinkComponent } from "shared/components";

export const AccountComponent = () => {
  const { user } = useUser();

  if (!user) return <div>loading...</div>;

  return (
    <div className={styles.content}>
      <h2>Account</h2>
      <label title={user?.email}>{getCensoredEmail(user?.email)}</label>
      <label title={user?.accountId}>{user?.username}</label>
      <OtpComponent />
      <LanguagesComponent />
      <GithubComponent />
      <div className={styles.delete}>
        <LinkComponent to="/account/delete">
          <ButtonComponent color="grey">Delete account</ButtonComponent>
        </LinkComponent>
      </div>
    </div>
  );
};
