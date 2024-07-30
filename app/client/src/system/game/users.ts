import { User } from "shared/types";

export const users = () => {
  let $user: User;

  const setCurrentUser = (user: User) => {
    $user = user;
  };

  const getCurrentUser = (): User => $user;

  return {
    setCurrentUser,
    getCurrentUser,
  };
};
