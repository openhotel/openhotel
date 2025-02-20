import { BlobReader, BlobWriter, ZipReader } from "@zip-js/data-uri";
import { parse } from "@std/yaml";

import { RequestType, RequestMethod } from "@oh/utils";
import { getBase64ImageFromBlob } from "shared/utils/image.utils.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

export const importRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/import",
  kind: RequestKind.ACCOUNT,
  func: async (request, url) => {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    const blob = new Blob([file]);
    const blobReader = new BlobReader(blob);
    const zipReader = new ZipReader(blobReader);

    const files = await zipReader.getEntries();

    const dataFile = files.find(($file) => $file.filename === "data.yml");
    const furnitureBlob = await dataFile.getData(new BlobWriter());
    const furnitureData = await parse(await furnitureBlob.text());

    const sheetFile = files.find(($file) => $file.filename === "sheet.json");
    const sheetFileBlob = await sheetFile.getData(new BlobWriter());
    const sheetFileData = JSON.parse(await sheetFileBlob.text());

    const spriteFile = files.find(($file) => $file.filename === "sprite.png");
    const spriteFileBlob = await spriteFile.getData(new BlobWriter());
    // const spriteFileData = await sheetFileBlob.text();

    const spriteBase64 = await getBase64ImageFromBlob(spriteFileBlob);

    return Response.json(
      {
        status: 200,
        data: {
          furniture: furnitureData,
          sheet: sheetFileData,
          sprite: spriteBase64,
        },
      },
      { status: 200 },
    );
  },
};
