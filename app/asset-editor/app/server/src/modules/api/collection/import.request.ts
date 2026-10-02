import {
  BlobReader,
  BlobWriter,
  TextWriter,
  ZipReader,
} from "@zip-js/data-uri";
import { parse } from "@std/yaml";

import { RequestType, RequestMethod, RequestKind } from "@oh/utils";
import { getFurnitureSummary } from "shared/utils/furniture.utils.ts";

const getErrorResponse = (message: string) =>
  Response.json({ status: 400, message }, { status: 400 });

export const importRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/import",
  kind: RequestKind.ACCOUNT,
  func: async (request) => {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    try {
      const files = await new ZipReader(
        new BlobReader(new Blob([file])),
      ).getEntries();

      const collectionFile = files.find(
        ($file) => $file.filename === "collection.yml",
      );
      if (!collectionFile) {
        return getErrorResponse("collection.yml is missing");
      }

      const collectionText = await collectionFile.getData(new TextWriter());
      const collection = parse(collectionText) ?? {};

      const furnitureFiles = files.filter(($file) =>
        $file.filename.endsWith(".furniture"),
      );

      const furniture = await Promise.all(
        furnitureFiles.map(async ($file) => {
          const blob = await $file.getData(new BlobWriter());
          const summary = await getFurnitureSummary(blob);
          return { ...summary, filename: $file.filename };
        }),
      );

      return Response.json({ status: 200, data: { collection, furniture } });
    } catch (e) {
      return getErrorResponse("Invalid collection file");
    }
  },
};
