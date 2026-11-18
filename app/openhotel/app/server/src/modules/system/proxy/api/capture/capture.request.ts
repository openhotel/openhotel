import { ProxyRequestType } from "shared/types/api.types.ts";
import { System } from "modules/system/main.ts";
import { RequestMethod } from "@shared/enums/request.enums.ts";
import { getContentType } from "@shared/utils/content-type.utils.ts";

export const captureRequest: ProxyRequestType = {
  pathname: "",
  method: RequestMethod.GET,
  public: true,
  func: async ({}, url) => {
    const captureId = url.searchParams.get("id");

    if (!captureId)
      return {
        status: 404,
      };

    const imageData = await System.phantom.getCapture(captureId);

    if (!imageData)
      return {
        status: 404,
      };

    return {
      status: 200,
      data: imageData,
      headers: {
        "Content-Type": getContentType(".png"),
      },
    };
  },
};
