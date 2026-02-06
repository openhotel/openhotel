import { RestrictionCode } from "shared/enums";

export type User = {
  createdAt: number;
  accountId: string;
  username: string;
  email: string;
  languages: string[];

  admin?: boolean;
  otp?: boolean;
  verified?: boolean;
  githubLogin?: string;

  // [from, kind]
  restrictions?: [number, RestrictionCode];
  blocked?: boolean;
};
