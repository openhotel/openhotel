import { System } from "system/main.ts";
import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
  RequestKind,
} from "@oh/utils";
import { ulid } from "@std/ulid";
import { Buffer } from "node:buffer";
import { type File } from "shared/types/main.ts";

export const putRequest: RequestType = {
  method: RequestMethod.PUT,
  pathname: "",
  kind: RequestKind.ADMIN,
  func: async (request) => {
    const formData = await request.formData();
    const file = formData.get("file");

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (!file || typeof file === "string" || file.size > MAX_SIZE) {
      return getResponse(HttpStatusCode.BAD_REQUEST);
    }

    const fileName = file.name;
    const baseName = fileName.substring(0, fileName.lastIndexOf("."));

    const $file: File = {
      id: ulid(),
      name: baseName,
      createdAt: Date.now(),
      mimeType: file.type,
    };

    const arrayBuffer = await file.arrayBuffer();
    const nodeBuffer = Buffer.from(arrayBuffer);

    await System.files.set($file, nodeBuffer);

    return getResponse(HttpStatusCode.OK, {
      data: {
        file: $file,
      },
    });
  },
};
