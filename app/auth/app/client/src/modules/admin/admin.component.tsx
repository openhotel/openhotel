import React, { FormEvent, useCallback, useEffect, useState } from "react";
import { useAccount, useAdmin, useApi, useQR } from "shared/hooks";
import { useNavigate } from "react-router-dom";
import { LinkComponent } from "shared/components";

export const AdminComponent: React.FC = () => {
  const { getList, remove, add } = useAdmin();

  const [adminList, setAdminList] = useState<
    {
      accountId: string;
      username: string;
      email: string;
    }[]
  >([]);

  const $reloadList = () =>
    getList().then(({ data }) => setAdminList(data.adminList));

  useEffect(() => {
    $reloadList();
  }, []);

  const removeAdmin = (email) => () => {
    remove(email).then(() => $reloadList());
  };

  const onSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.target as unknown as HTMLFormElement);
    const email = data.get("email") as string;

    if (!email) return;

    add(email).then(() => $reloadList());
  }, []);

  if (!adminList.length) return <div>Loading...</div>;

  return (
    <div>
      <h1>Admin</h1>
      <div>
        {adminList.map((user) => (
          <div key={user.accountId}>
            {user.email} - {user.username}
            <button onClick={removeAdmin(user.email)}>delete</button>
          </div>
        ))}
        <br />
        <form onSubmit={onSubmit}>
          <input name="email" placeholder="email" />
          <button>add admin</button>
        </form>
      </div>
      <br />
    </div>
  );
};
