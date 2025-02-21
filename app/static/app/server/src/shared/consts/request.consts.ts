import { RequestKind } from "../enums/main.ts";

export const REQUEST_KIND_COLOR_MAP: Record<RequestKind, string> = {
  [RequestKind.PUBLIC]: "#ffffff",
  [RequestKind.ACCOUNT]: "#4a9d44",
  [RequestKind.ADMIN]: "#bb2727",
};
