import { System } from "system/main.ts";
import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { ulid } from "@std/ulid";
import { type File } from "shared/types/main.ts";
import { ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES } from "shared/consts/main.ts";
import { Buffer } from "node:buffer";

export const putRequest: RequestType = {
  method: RequestMethod.PUT,
  pathname: "",
  func: async (request) => {
    const formData = await request.formData();
    const file = formData.get("file");

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (!file || typeof file === "string" || file.size > MAX_SIZE) {
      return getResponse(HttpStatusCode.BAD_REQUEST);
    }

    const fileName = file.name;
    const fileExtension = fileName.split(".").pop()?.toLowerCase();

    if (
      !fileExtension ||
      !ALLOWED_EXTENSIONS.includes(fileExtension) ||
      !ALLOWED_MIME_TYPES.includes(file.type)
    ) {
      return getResponse(HttpStatusCode.BAD_REQUEST);
    }

    const baseName = fileName.substring(0, fileName.lastIndexOf("."));

    const $file: File = {
      id: ulid(),
      name: baseName,
      createdAt: Date.now(),
      mimeType: fileExtension,
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
