import { getFurnitureSummary } from "shared/utils/furniture.utils.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { RequestKind, RequestMethod } from "@shared/enums/request.enums.ts";

export const furnitureRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/furniture",
  kind: RequestKind.ACCOUNT,
  func: async (request) => {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    try {
      const furniture = await Promise.all(
        files.map((file) => getFurnitureSummary(new Blob([file]))),
      );

      return Response.json({ status: 200, data: { furniture } });
    } catch (e) {
      return Response.json(
        { status: 400, message: "Invalid furniture file" },
        { status: 400 },
      );
    }
  },
};
