import { CurrentUser } from "shared/types";
import { System } from "system/system";
import { SystemEvent } from "shared/enums";

export const users = () => {
  let $user: CurrentUser;

  const setCurrentUser = (user: CurrentUser) => {
    $user = user;
    System.events.emit(SystemEvent.CURRENT_USER_SET, user);
  };

  const getCurrentUser = (): CurrentUser => $user;

  return {
    setCurrentUser,
    getCurrentUser,
  };
};
