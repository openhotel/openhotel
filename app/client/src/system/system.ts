import { account } from "system/account";
import { tasks } from "system/tasks";
import { contributors } from "system/contributors";

export const System = (() => {
  const $tasks = tasks();
  const $account = account();
  const $contributors = contributors();

  const load = () => {
    $tasks.load();
    $contributors.load();
  };

  return {
    tasks: $tasks,
    account: $account,
    contributors: $contributors,

    load,
  };
})();
