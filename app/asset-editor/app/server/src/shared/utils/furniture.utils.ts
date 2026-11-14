import { BlobReader, TextWriter, ZipReader } from "@zip-js/data-uri";
import { parse } from "@std/yaml";

import { blobToBase64 } from "./base64.utils.ts";

export type FurnitureSummary = {
  id: string;
  lang: Record<string, { name: string; description: string }>;
  size: number;
  file: string;
};

export const getFurnitureSummary = async (
  blob: Blob,
): Promise<FurnitureSummary> => {
  const files = await new ZipReader(new BlobReader(blob)).getEntries();

  const readZipYaml = async (filename: string) => {
    const file = files.find(($file) => $file.filename === filename);
    if (!file) return null;

    const text = await file.getData(new TextWriter());
    return parse(text);
  };

  const data = await readZipYaml("data.yml");
  const lang = await readZipYaml("lang.yml");

  const file = await blobToBase64(
    new Blob([blob], { type: "application/octet-stream" }),
  );

  return {
    id: data?.id ?? "",
    lang,
    size: blob.size,
    file,
  };
};
