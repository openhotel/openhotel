import { account } from "system/account";
import { tasks } from "system/tasks";
import { contributors } from "system/contributors";
import { modals } from "system/modals";
import { config } from "system/config";
import { api } from "system/api";

export const System = (() => {
  const $tasks = tasks();
  const $account = account();
  const $contributors = contributors();
  const $modals = modals();
  const $config = config();
  const $api = api();

  const load = () => {
    $tasks.load();
    $contributors.load();
  };
  return {
    tasks: $tasks,
    account: $account,
    contributors: $contributors,
    modals: $modals,
    config: $config,
    api: $api,

    load,
  };
})();
