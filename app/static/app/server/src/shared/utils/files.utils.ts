import { ALLOWED_MIME_TYPES } from "../consts/files.consts.ts";

export const isAllowedMimeType = (mime: string) =>
  ALLOWED_MIME_TYPES.some((allowed) => {
    if (allowed.includes("*")) {
      const prefix = allowed.split("*")[0];
      return mime.startsWith(prefix);
    }
    return mime === allowed;
  });
