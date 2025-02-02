import { RequestKind } from "shared/enums/request.enums.ts";
import { RequestMethod } from "@oh/utils";

export const REQUEST_KIND_COLOR_MAP: Record<RequestKind, string> = {
  [RequestKind.PUBLIC]: "#ffffff",
  [RequestKind.ACCOUNT]: "#4a9d44",
  [RequestKind.LICENSE]: "#b74cc9",
  [RequestKind.CONNECTION]: "#b98d29",
  [RequestKind.ADMIN]: "#bb2727",
  [RequestKind.TOKEN]: "#2d4fa6",
};

export const REQUEST_METHOD_COLOR_MAP: Record<RequestMethod, string> = {
  [RequestMethod.GET]: "#abf1c1",
  [RequestMethod.POST]: "#9dbce1",
  [RequestMethod.PATCH]: "#dcb489",
  [RequestMethod.DELETE]: "#e38c8c",
};
