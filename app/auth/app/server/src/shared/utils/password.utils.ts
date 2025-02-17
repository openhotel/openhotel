import { getPasswordsPepper } from "shared/utils/pepper.utils.ts";
import { BCRYPT_MAX_LENGTH } from "shared/consts/password.consts.ts";

export const getPasswordMaxLength = async (): Promise<number> => {
  const pepper = await getPasswordsPepper();

  return BCRYPT_MAX_LENGTH - pepper.length - 1;
};
