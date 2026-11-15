import { RequestKind } from "../types/request.types.ts";

export const REQUEST_KIND_COLOR_MAP: Record<RequestKind, string> = {
  [RequestKind.PUBLIC]: "#ffffff",
  [RequestKind.ACCOUNT]: "#4a9d44",
  [RequestKind.ACCOUNT_REFRESH]: "#b4d95e",
  [RequestKind.LICENSE]: "#b74cc9",
  [RequestKind.CONNECTION]: "#b98d29",
  [RequestKind.ADMIN]: "#bb2727",
  [RequestKind.TOKEN]: "#2d4fa6",
  [RequestKind.APPS]: "#41c4d0",
};
