export type User = {
  createdAt: string;
  accountId: string;
  username: string;
  email: string;
  admin?: boolean;
  otp?: boolean;
  verified?: boolean;
};
