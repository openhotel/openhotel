import { Hemisphere } from "@shared/enums/hemisphere.enums.ts";

export type Account = {
  accountId: string;
  username: string;
  apiToken: string;
  hemisphere: Hemisphere;
  admin?: boolean;
};
