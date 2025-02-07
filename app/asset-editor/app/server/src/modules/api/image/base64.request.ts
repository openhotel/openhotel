import { RequestType } from "shared/types/main.ts";
import { RequestMethod } from "shared/enums/main.ts";
import { getBase64Image } from "shared/utils/image.utils.ts";
import { Image } from "imagescript";

export const base64Request: RequestType = {
  method: RequestMethod.POST,
  pathname: "/base64",
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
