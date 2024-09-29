import React, { FormEvent, useCallback, useEffect, useState } from "react";
import { useAdmin, useApi } from "shared/hooks";

export const AdminComponent: React.FC = () => {
  const { getList, remove, add, update } = useAdmin();
  const { getVersion } = useApi();

  const [adminList, setAdminList] = useState<
    {
      accountId: string;
      username: string;
      email: string;
    }[]
  >([]);
  const [version, setVersion] = useState<string>();

  const $reloadList = () =>
    getList().then(({ data }) => setAdminList(data.adminList));

  useEffect(() => {
    $reloadList();
    getVersion().then(({ version }) => setVersion(version));
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

  const $update = () => {
    update().then(({ status }) => {
      if (status === 200)
        //TODO is updating!
        setTimeout(() => {
          window.location.reload();
        }, 10_000);
    });
  };

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
      <hr />
      <h3>Update</h3>
      <button onClick={$update}>Update</button>
      <br />
      <b>{version}</b>
      <br />
    </div>
  );
};
