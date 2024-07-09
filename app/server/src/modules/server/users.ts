import { User } from "shared/types/main.ts";

type GetProps = {
  id?: string;
  username?: string;
  clientId?: string;
};

export const users = () => {
  let $userMap: Record<string, User> = {};

  const add = (user: User) => {
    $userMap[user.id] = user;
  };

  const remove = (user: User) => {
    delete $userMap[user.id];
  };

  const get = ({ id, clientId, username }: GetProps) => {
    if (id) return $userMap[id];
    if (username) return getAll().find((user) => user.username === username);
    if (clientId) return getAll().find((user) => user.clientId === clientId);
  };

  const getAll = (): User[] => Object.values($userMap);

  return {
    add,
    remove,
    get,
    getAll,
  };
};
