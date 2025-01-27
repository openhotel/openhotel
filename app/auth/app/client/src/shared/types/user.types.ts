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
};
