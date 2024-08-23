import { Image } from "imagescript";

export const getBase64Image = async (image: Image): Promise<string> => {
  const base64Image = await image.encode(0);
  const base64String = btoa(String.fromCharCode(...base64Image));
  return `data:image/png;base64,${base64String}`;
};

export const getEmptyImage = (
  width: number,
  height: number,
  color: number = 0xff00ffff,
): Image => {
  const image = new Image(width, height);
  return image.drawBox(1, 1, width, height, color);
};
