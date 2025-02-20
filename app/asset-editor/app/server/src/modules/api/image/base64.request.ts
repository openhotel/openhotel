import { RequestType, RequestMethod } from "@oh/utils";
import { getBase64Image } from "shared/utils/image.utils.ts";
import { Image } from "imagescript";
import { RequestKind } from "shared/enums/request.enums.ts";

export const base64Request: RequestType = {
  method: RequestMethod.POST,
  pathname: "/base64",
  kind: RequestKind.ACCOUNT,
  func: async (request, url) => {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    const image = await Image.decode(await file.arrayBuffer());

    return Response.json(
      {
        status: 200,
        data: {
          base64: await getBase64Image(image),
          size: {
            width: image.width,
            height: image.height,
          },
        },
      },
      { status: 200 },
    );
  },
};
