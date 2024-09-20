import { CurrentUser } from "shared/types";

export const users = () => {
  let $user: CurrentUser;

  const setCurrentUser = (user: CurrentUser) => {
    $user = user;
  };

  const getCurrentUser = (): CurrentUser => $user;

  return {
    setCurrentUser,
    getCurrentUser,
  };
};
