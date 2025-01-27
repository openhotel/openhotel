export type Account = {
  accountId: string;
  username: string;
  emailHash: string;
  passwordHash: string;
  createdAt: Date;
  verified: boolean;
  languages: string[];
};
