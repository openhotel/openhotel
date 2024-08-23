import { RequestType } from "shared/types/main.ts";
import { RequestMethod } from "shared/enums/main.ts";
import { getPathFromUrl } from "shared/utils/url.utils.ts";
import { System } from "system/main.ts";

export const postWriteFileRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/write-file",
  func: async (request, url) => {
    try {
      const formData = await request.formData();
      const path = getPathFromUrl(url);
      await System.data.mkdir(path);

      for (const [, value] of formData.entries())
        if (value instanceof File)
          await System.data.writeFile(`${path}/${value.name}`, value.stream());

      return Response.json({ status: 200 }, { status: 200 });
    } catch (e) {
      console.error(e);
      return Response.json({ status: 500 }, { status: 500 });
    }
  },
};
