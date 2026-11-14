import { describe, it, expect } from "@jest/globals";
import { CompanyPermissionsEnum } from "../../enums/company.enums.ts";
import {
  decodeContractPermissions,
  encodeContractPermissions,
} from "../company.utils.ts";

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
        const encoded = encodeContractPermissions(allTrue);
        expect(encoded).toBe(0b111111); // 63
      });

      it("with all permissions false", () => {
        const encoded = encodeContractPermissions(allFalse);
        expect(encoded).toBe(0); // 0
      });

      it("decodeContractPermissions for encoded 63 returns all true", () => {
        const decoded = decodeContractPermissions(63);
        expect(decoded).toEqual(allTrue);
      });

      it("decodeContractPermissions for encoded 0 returns all false", () => {
        const decoded = decodeContractPermissions(0);
        expect(decoded).toEqual(allFalse);
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
        const decoded = decodeContractPermissions(encoded);
        expect(decoded).toEqual(original);
      });

      it("bit order of CompanyPermissions enum must match bit position", () => {
        const expectedOrder = [
          "canSpendCredits",
          "canBuyFurnis",
          "canSellFurnis",
          "canMoveFurnis",
          "canCreateRooms",
          "canDeleteRooms",
        ];

        const enumOrder = Object.values(CompanyPermissionsEnum);
        expect(enumOrder).toEqual(expectedOrder);
      });
    });
  });
});
