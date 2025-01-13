export type User = {
  createdAt: number;
  accountId: string;
  username: string;
  email: string;
  admin?: boolean;
  otp?: boolean;
  verified?: boolean;
};
