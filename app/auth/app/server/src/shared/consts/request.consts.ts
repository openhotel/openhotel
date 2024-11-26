import { RequestKind } from "shared/enums/request.enums.ts";

export const REQUEST_KIND_COLOR_MAP: Record<RequestKind, string> = {
  [RequestKind.PUBLIC]: "white",
  [RequestKind.ACCOUNT]: "green",
  [RequestKind.CONNECTION]: "yellow",
  [RequestKind.ADMIN]: "red",
  [RequestKind.TOKEN]: "orange",
};
