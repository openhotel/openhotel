import { CompanyPermissionsEnum } from "../enums/company.enums.ts";

export type CompanyPermissions = {
  [key in CompanyPermissionsEnum]: boolean;
};
