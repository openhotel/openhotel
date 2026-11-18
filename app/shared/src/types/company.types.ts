import { CompanyPermissionsEnum } from "@shared/enums/company.enums.ts";

export type CompanyPermissions = {
  [key in CompanyPermissionsEnum]: boolean;
};
