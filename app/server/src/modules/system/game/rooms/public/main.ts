import { getRoom } from "./room.ts";
import { PublicRoomMutable } from "shared/types/rooms/public.types.ts";
import {
  getRoomSpawnDirection,
  getRoomSpawnPoint,
} from "shared/utils/rooms.utils.ts";
import { log } from "shared/utils/log.utils.ts";
import { BlobReader, BlobWriter, ZipReader } from "@zip-js/data-uri";
import { parse } from "@std/yaml";

const PUBLIC_ROOMS_PATH = "./assets/rooms/public";

export const $public = () => {
  let roomUserMap: Record<string, string[]> = {};

  const $getRoom = getRoom(roomUserMap);

  const unzipZipFile = async (dirEntry: Deno.DirEntry, path: string = "") => {
    if (!dirEntry.isFile) {
      for await (const childEntry of Deno.readDir(
        `${PUBLIC_ROOMS_PATH}/${dirEntry.name}`,
      ))
        await unzipZipFile(childEntry, `${dirEntry.name}/`);
    }

    const roomPathname = `${PUBLIC_ROOMS_PATH}/${path + dirEntry.name}`;

    const file = await Deno.readFile(roomPathname);

    const blob = new Blob([file]);
    const blobReader = new BlobReader(blob);
    const zipReader = new ZipReader(blobReader);

    const files = await zipReader.getEntries();

    const dataFile = files.find(($file) => $file.filename === "data.yml");
    const sheetFile = files.find(($file) => $file.filename === "sheet.json");
    const spriteFile = files.find(($file) => $file.filename === "sprite.png");
    const langFile = files.find(($file) => $file.filename === "lang.yml");

    const missingFiles = [
      dataFile ? "data.yml" : null,
      sheetFile ? "sheet.json" : null,
      spriteFile ? "sprite.png" : null,
    ].filter(Boolean);

    if (!missingFiles.length) {
      log(
        `Public room ${dirEntry.name} is missing (${missingFiles.join(",")}) files!`,
      );
      return;
    }

    // data
    const furnitureBlob = await dataFile.getData(new BlobWriter());
    const furnitureUint8Array = new Uint8Array(
      await furnitureBlob.arrayBuffer(),
    );
    const furnitureData = await parse(await furnitureBlob.text());
  };

  const load = async () => {
    log("> Loading public rooms...");

    for await (const dirEntry of Deno.readDir(PUBLIC_ROOMS_PATH))
      await unzipZipFile(dirEntry);
    log("> Public rooms loaded!");
  };

  const get = async (roomId: string): Promise<PublicRoomMutable | null> => {
    return $getRoom({
      type: "public",
      version: 1,
      id: "01JM5ZKX5BCD1H3EWQS3Y657PP",
      title: "Public test",
      description: "This is a public room",
      layout: [],
      maxUsers: 100,
      spawnPoint: getRoomSpawnPoint([]),
      spawnDirection: getRoomSpawnDirection([]),
    });
  };
  const getList = async (): Promise<PublicRoomMutable[]> => {
    return [await get(null)];
  };

  // const getList = async (): Promise<PrivateRoomMutable[]> => {
  //   return (await System.db.list({ prefix: ["rooms", "private"] })).map(
  //     (item) => $getRoom(item.value),
  //   );
  // };

  return {
    load,

    get,

    getList,
  };
};
