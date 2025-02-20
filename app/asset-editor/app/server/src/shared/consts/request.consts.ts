import { RequestKind } from "shared/enums/request.enums.ts";

export const REQUEST_KIND_COLOR_MAP: Record<RequestKind, string> = {
  [RequestKind.PUBLIC]: "#ffffff",
  [RequestKind.ACCOUNT]: "#4a9d44",
};
