import { useUser } from "shared/hooks";
import React from "react";
import { getCensoredEmail } from "shared/utils";
import { GithubComponent, LanguagesComponent } from "./components";
//@ts-ignore
import styles from "./account.module.scss";

export const AccountComponent = () => {
  const { user } = useUser();

  if (!user) return <div>loading...</div>;

  return (
    <div className={styles.content}>
      <h2>Account</h2>
      <label title={user?.email}>{getCensoredEmail(user?.email)}</label>
      <label title={user?.accountId}>{user?.username}</label>
      <LanguagesComponent />
      <GithubComponent />
    </div>
  );
};
