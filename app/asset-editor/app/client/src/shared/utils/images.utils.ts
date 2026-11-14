import { Size2d } from "shared/types";

export const getBase64FromBody = async (body: Response): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    if (body.status !== 200) return reject();
    const reader = new FileReader();
    reader.readAsDataURL(await body.blob());
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
  });
};

export const getImageSize = (url: string): Promise<Size2d> =>
  new Promise<Size2d>((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const width = img.width;
      const height = img.height;
      resolve({ width, height });
    };

    img.onerror = () => reject(new Error("Failed to load image."));

    img.src = url;
  });
