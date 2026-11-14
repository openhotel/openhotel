import { Image } from "imagescript";
import { blobToBase64 } from "shared/utils/base64.utils.ts";

export const getBase64Image = async (image: Image): Promise<string> => {
  const base64Image = await image.encode(0);
  const base64String = btoa(String.fromCharCode(...base64Image));
  return `data:image/png;base64,${base64String}`;
};

export const getBase64ImageFromBlob = async (blob: Blob): Promise<string> => {
  const base64 = await blobToBase64(blob);
  return `data:image/png;base64,${base64.split(",")[1]}`;
};

export const getEmptyImage = (
  width: number,
  height: number,
  color: number = 0xff00ffff,
): Image => {
  const image = new Image(width, height);
  return image.drawBox(1, 1, width, height, color);
};
