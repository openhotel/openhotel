import { account } from "system/account";
import { tasks } from "system/tasks";

export const System = (() => {
  const $tasks = tasks();
  const $account = account();

  const load = () => {
    $tasks.load();
  };

  return {
    tasks: $tasks,
    account: $account,

    load,
  };
})();
