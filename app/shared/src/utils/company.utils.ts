import { CompanyPermissionsEnum } from "../enums/company.enums.ts";
import type { CompanyPermissions } from "../types/company.types.ts";

export const decodeContractPermissions = (
  permissions: number,
): CompanyPermissions => ({
  [CompanyPermissionsEnum.SPEND_CREDITS]: Boolean(permissions & (1 << 0)),
  [CompanyPermissionsEnum.BUY_FURNIS]: Boolean(permissions & (1 << 1)),
  [CompanyPermissionsEnum.SELL_FURNIS]: Boolean(permissions & (1 << 2)),
  [CompanyPermissionsEnum.MOVE_FURNIS]: Boolean(permissions & (1 << 3)),
  [CompanyPermissionsEnum.CREATE_ROOMS]: Boolean(permissions & (1 << 4)),
  [CompanyPermissionsEnum.DELETE_ROOMS]: Boolean(permissions & (1 << 5)),
});

export const encodeContractPermissions = (
  permissions: Record<CompanyPermissionsEnum, boolean>,
): number => {
  let encoded = 0;

  if (permissions.canSpendCredits) encoded |= 1 << 0;
  if (permissions.canBuyFurnis) encoded |= 1 << 1;
  if (permissions.canSellFurnis) encoded |= 1 << 2;
  if (permissions.canMoveFurnis) encoded |= 1 << 3;
  if (permissions.canCreateRooms) encoded |= 1 << 4;
  if (permissions.canDeleteRooms) encoded |= 1 << 5;

  return encoded;
};
