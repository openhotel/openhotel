import { BlobReader, BlobWriter, ZipWriter } from "@zip-js/data-uri";
import { stringify } from "@std/yaml";

import { RequestType, RequestMethod, RequestKind } from "@oh/utils";
import { base64ToBlob } from "shared/utils/base64.utils.ts";

export const createRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/create",
  kind: RequestKind.ACCOUNT,
  func: async (request, url) => {
    const { sprite, sheet, furniture } = await request.json();

    const $sprite = base64ToBlob(sprite);
    const $sheet = new Blob([JSON.stringify(sheet)], {
      type: "application/json",
    });
    const $furniture = new Blob([stringify(furniture)], {
      type: "application/json",
    });

    const zipWriter = new ZipWriter(new BlobWriter("application/zip"));

    // Add the files to the zip archive with the desired file names.
    await zipWriter.add("sprite.png", new BlobReader($sprite));
    await zipWriter.add("sheet.json", new BlobReader($sheet));
    await zipWriter.add("data.yml", new BlobReader($furniture));

    const zipBlob = await zipWriter.close();

    return new Response(zipBlob, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="archive.zip"',
      },
    });
  },
};
