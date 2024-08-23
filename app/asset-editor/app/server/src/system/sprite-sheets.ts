import { System } from "system/main.ts";
import {
  getDecodedText,
  getEmptyImage,
  getEncodedText,
  getUint8ArrayFromReadableStream,
} from "shared/utils/main.ts";
import { SpriteSheet } from "shared/types/main.ts";
import { Image } from "imagescript";

const SPRITE_SHEETS_PATH = "/sprite-sheets";

export const spriteSheets = () => {
  const load = async () => {
    await System.data.mkdir(SPRITE_SHEETS_PATH);
  };

  const $getPath = (path: string) => `${SPRITE_SHEETS_PATH}/${path}`;

  const getList = async (): Promise<string[]> => {
    const files = await System.data.readDir(SPRITE_SHEETS_PATH);
    return files.filter((file) => file.isDirectory).map((file) => file.name);
  };

  const create = async (id: string) => {
    const path = $getPath(id);
    await System.data.mkdir(path);

    const sprite = await getEmptyImage(128, 128);

    const sheet: SpriteSheet = {
      frames: {},
      animations: {},
      meta: {
        format: "RGBA8888",
        image: "sprite.png",
        size: {
          w: 128,
          h: 128,
        },
        scale: 1,
      },
    };
    await updateSheet(id, sheet);
    await updateSprite(id, sprite);
  };

  const $updateMetaSheetSize = async (id: string, image: Image) => {
    const sheet = JSON.parse(getDecodedText(await getSheet(id))) as SpriteSheet;

    await updateSheet(id, {
      ...sheet,
      meta: {
        ...sheet.meta,
        size: {
          w: image.width,
          h: image.height,
        },
      },
    });
  };

  const updateSprite = async (id: string, image: Image) => {
    await System.data.writeFile(
      `${$getPath(id)}/sprite.png`,
      await image.encode(0),
    );
    await $updateMetaSheetSize(id, image);
  };

  const updateRawSprite = async (
    id: string,
    raw: ReadableStream<Uint8Array> | Uint8Array,
  ) => {
    const path = `${$getPath(id)}/sprite.png`;
    await System.data.writeFile(path, raw);

    const data = await System.data.readFile(path);
    const image = await Image.decode(data);
    await $updateMetaSheetSize(id, image);
  };
  const updateSheet = async (id: string, sheet: SpriteSheet) =>
    System.data.writeFile(
      $getPath(id) + "/sheet.json",
      getEncodedText(JSON.stringify(sheet)),
    );

  const updateRawSheet = async (
    id: string,
    raw: ReadableStream<Uint8Array> | Uint8Array,
  ) => {
    const sheetData = JSON.parse(
      getDecodedText(await getUint8ArrayFromReadableStream(raw)),
    ) as SpriteSheet;

    const sheet = JSON.parse(getDecodedText(await getSheet(id))) as SpriteSheet;
    sheet.frames = sheetData.frames;
    sheet.animations = sheetData.animations;

    await updateSheet(id, sheet);
  };

  const getSprite = async (id: string): Promise<Uint8Array> =>
    System.data.readFile($getPath(id) + "/sprite.png");

  const getSheet = (id: string): Promise<Uint8Array> =>
    System.data.readFile($getPath(id) + "/sheet.json");

  const remove = (id: string) => System.data.remove($getPath(id));

  return {
    load,

    getList,

    getSprite,
    updateSprite,
    updateRawSprite,

    getSheet,
    updateSheet,
    updateRawSheet,

    create,

    remove,
  };
};
