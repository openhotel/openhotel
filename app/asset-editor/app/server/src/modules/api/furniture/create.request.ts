import { BlobReader, BlobWriter, ZipWriter } from "@zip-js/data-uri";
import { stringify } from "@std/yaml";
import { decodeTime } from "@std/ulid";

import { RequestType, RequestMethod, RequestKind } from "@oh/utils";
import { base64ToBlob } from "shared/utils/base64.utils.ts";
import { getFurnitureLangErrors } from "@oh/core";

export const createRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/create",
  kind: RequestKind.ACCOUNT,
  func: async (request) => {
    const { sprite, sheet, furniture, lang } = await request.json();

    let lastModDate: Date;
    try {
      lastModDate = new Date(decodeTime(furniture?.revision));
    } catch (e) {
      return Response.json(
        { status: 400, message: "Invalid furniture revision" },
        { status: 400 },
      );
    }

    const langErrors = getFurnitureLangErrors(lang);
    if (langErrors.length) {
      return Response.json(
        { status: 400, message: langErrors.join("\n") },
        { status: 400 },
      );
    }

    const $sprite = base64ToBlob(sprite);
    const $sheet = new Blob([JSON.stringify(sheet)], {
      type: "application/json",
    });
    const $furniture = new Blob([stringify(furniture)], {
      type: "application/json",
    });
    const $lang = new Blob([stringify(lang)], {
      type: "application/json",
    });

    const zipWriter = new ZipWriter(new BlobWriter("application/zip"));

    // Add the files to the zip archive with the desired file names.
    const options = { lastModDate };
    await zipWriter.add("sprite.png", new BlobReader($sprite), options);
    await zipWriter.add("sheet.json", new BlobReader($sheet), options);
    await zipWriter.add("data.yml", new BlobReader($furniture), options);
    await zipWriter.add("lang.yml", new BlobReader($lang), options);

    const zipBlob = await zipWriter.close();

    return new Response(zipBlob, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="archive.furniture"',
      },
    });
  },
};
