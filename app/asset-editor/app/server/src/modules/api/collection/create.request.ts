import { BlobReader, BlobWriter, ZipWriter } from "@zip-js/data-uri";
import { stringify } from "@std/yaml";

import { RequestType, RequestMethod, RequestKind } from "@oh/utils";
import {
  COLLECTION_FURNITURE_MAX_SIZE,
  getCollectionFurnitureListErrors,
  getCollectionMetadataErrors,
} from "@oh/core";
import { base64ToBlob } from "shared/utils/base64.utils.ts";
import { normalizeCollection } from "shared/utils/collection.utils.ts";

export const createRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/create",
  kind: RequestKind.ACCOUNT,
  func: async (request) => {
    const { collection: $collection, furniture } = await request.json();

    if (!Array.isArray(furniture) || !furniture.length) {
      return Response.json(
        {
          status: 400,
          message: "a collection must have at least 1 furniture",
        },
        { status: 400 },
      );
    }

    const collection = normalizeCollection($collection);

    let files: { id: string; blob: Blob }[];
    try {
      files = furniture.map(({ id, file }) => ({
        id,
        blob: base64ToBlob(file),
      }));
    } catch (e) {
      return Response.json(
        { status: 400, message: "Invalid furniture file" },
        { status: 400 },
      );
    }

    const errors = [
      ...getCollectionMetadataErrors(collection),
      ...getCollectionFurnitureListErrors(
        collection.id,
        files.map(({ id }) => id),
      ),
      ...files
        .filter(({ blob }) => blob.size > COLLECTION_FURNITURE_MAX_SIZE)
        .map(
          ({ id }) =>
            `${id}: file is bigger than ${COLLECTION_FURNITURE_MAX_SIZE} bytes`,
        ),
    ];

    if (errors.length) {
      return Response.json(
        { status: 400, message: errors.join("\n") },
        { status: 400 },
      );
    }

    const collectionBlob = new Blob([stringify(collection)], {
      type: "application/yaml",
    });

    const zipWriter = new ZipWriter(new BlobWriter("application/zip"));
    await zipWriter.add("collection.yml", new BlobReader(collectionBlob));

    for (const file of files) {
      await zipWriter.add(`${file.id}.furniture`, new BlobReader(file.blob));
    }

    return new Response(await zipWriter.close(), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${collection.id}.collection"`,
      },
    });
  },
};
