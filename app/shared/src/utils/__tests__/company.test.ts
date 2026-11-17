import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { CompanyPermissionsEnum } from "@shared/enums/company.enums.ts";
import {
  decodeContractPermissions,
  encodeContractPermissions,
} from "@shared/utils/company.utils.ts";

describe("utils", () => {
  describe("company", () => {
    const allTrue = {
      [CompanyPermissionsEnum.SPEND_CREDITS]: true,
      [CompanyPermissionsEnum.BUY_FURNIS]: true,
      [CompanyPermissionsEnum.SELL_FURNIS]: true,
      [CompanyPermissionsEnum.MOVE_FURNIS]: true,
      [CompanyPermissionsEnum.CREATE_ROOMS]: true,
      [CompanyPermissionsEnum.DELETE_ROOMS]: true,
    };

    const allFalse = {
      [CompanyPermissionsEnum.SPEND_CREDITS]: false,
      [CompanyPermissionsEnum.BUY_FURNIS]: false,
      [CompanyPermissionsEnum.SELL_FURNIS]: false,
      [CompanyPermissionsEnum.MOVE_FURNIS]: false,
      [CompanyPermissionsEnum.CREATE_ROOMS]: false,
      [CompanyPermissionsEnum.DELETE_ROOMS]: false,
    };

    describe("encode/decode contract permissions", () => {
      it("with all permissions true", () => {
        expect(encodeContractPermissions(allTrue)).toBe(0b111111);
      });

      it("with all permissions false", () => {
        expect(encodeContractPermissions(allFalse)).toBe(0);
      });

      it("decodeContractPermissions for encoded 63 returns all true", () => {
        expect(decodeContractPermissions(63)).toEqual(allTrue);
      });

      it("decodeContractPermissions for encoded 0 returns all false", () => {
        expect(decodeContractPermissions(0)).toEqual(allFalse);
      });

      it("encode and decode consistency", () => {
        const original = {
          [CompanyPermissionsEnum.SPEND_CREDITS]: true,
          [CompanyPermissionsEnum.BUY_FURNIS]: false,
          [CompanyPermissionsEnum.SELL_FURNIS]: true,
          [CompanyPermissionsEnum.MOVE_FURNIS]: false,
          [CompanyPermissionsEnum.CREATE_ROOMS]: true,
          [CompanyPermissionsEnum.DELETE_ROOMS]: false,
        };
        const encoded = encodeContractPermissions(original);
        expect(decodeContractPermissions(encoded)).toEqual(original);
      });

      it("bit order of CompanyPermissions enum must match bit position", () => {
        expect(Object.values(CompanyPermissionsEnum)).toEqual([
          "canSpendCredits",
          "canBuyFurnis",
          "canSellFurnis",
          "canMoveFurnis",
          "canCreateRooms",
          "canDeleteRooms",
        ]);
      });
    });
  });
});
