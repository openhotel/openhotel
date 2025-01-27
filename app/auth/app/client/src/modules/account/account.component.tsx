import { useUser } from "shared/hooks";
import React from "react";
import { getCensoredEmail } from "shared/utils";
import { LanguagesComponent } from "./components";

export const AccountComponent = () => {
  const { user } = useUser();

  if (!user) return <div>loading...</div>;

  return (
    <div>
      <h2>Account</h2>
      <p title={user?.email}>{getCensoredEmail(user?.email)}</p>
      <p title={user?.accountId}>{user?.username}</p>
      <LanguagesComponent />
    </div>
  );
};
