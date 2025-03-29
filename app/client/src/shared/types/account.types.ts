import { Hemisphere } from "shared/enums";

export type Account = {
  accountId: string;
  username: string;
  apiToken: string;
  hemisphere: Hemisphere;
};
