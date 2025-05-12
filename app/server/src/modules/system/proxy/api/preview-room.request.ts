import { ProxyRequestType } from "shared/types/api.types.ts";
import { RequestMethod, getContentType } from "@oh/utils";

const TILE_WIDTH = 2;
const TILE_Y_HEIGHT = 2;

const getPositionFromIsometricPosition = ({ x, y, z }) => ({
  x: (x * TILE_WIDTH - z * TILE_WIDTH) * 2,
  y: z * TILE_WIDTH + x * TILE_WIDTH - y * TILE_Y_HEIGHT,
});

const TEMP_SIZE = 512;
const MARGIN = 128;

export const previewRoomRequest: ProxyRequestType = {
  pathname: "/preview-room",
  method: RequestMethod.GET,
  public: true,
  func: async ({}, url) => {
    const { Image } = await import("imagescript");

    const image = new Image(TEMP_SIZE, TEMP_SIZE);

    const previewSpriteSheet = await Deno.readFile(
      "./assets/rooms/preview.png",
    );
    const sprite = await Image.decode(previewSpriteSheet);
    const getImage = (x, y, w, h) => sprite.clone().crop(x, y, w, h);

    let minX = 0;
    let maxX = 0;

    let minY = 0;
    let maxY = 0;

    const drawTile = ({ x, y, z }) => {
      const pos = getPositionFromIsometricPosition({ x, y, z });
      minX = Math.min(minX, pos.x);
      maxX = Math.max(maxX, pos.x + 8);
      minY = Math.min(minY, pos.y);
      maxY = Math.max(maxY, pos.y + 6);

      image.composite(
        getImage(10, 0, 8, 6).green(0.5),
        MARGIN + pos.x,
        MARGIN + pos.y,
      );
    };
    const drawStair = ({ x, y, z }) => {
      const pos = getPositionFromIsometricPosition({ x, y, z });
      minX = Math.min(minX, pos.x - 1);
      maxX = Math.max(maxX, pos.x + 9);
      minY = Math.min(minY, pos.y);
      maxY = Math.max(maxY, pos.y + 7);

      image.composite(
        getImage(10, 6, 9, 7),
        MARGIN + pos.x - 1,
        MARGIN + pos.y,
      );
    };
    const drawWall = ({ x, y, z }) => {
      const pos = getPositionFromIsometricPosition({ x, y, z });
      minX = Math.min(minX, pos.x);
      maxX = Math.max(maxX, pos.x);
      minY = Math.min(minY, pos.y - 13);
      maxY = Math.max(maxY, pos.y);

      image.composite(
        getImage(0, 0, 5, 17).blue(0.5),
        MARGIN + pos.x,
        MARGIN + pos.y - 13,
      );
    };

    for (let z = 0; z < 10; z++) {
      drawWall({ x: 0, y: 0, z });

      for (let x = 0; x < 10; x++) {
        drawTile({ x, y: 0, z });
      }
      drawStair({ x: 10, y: 0, z });
    }
    for (let z = 0; z < 10; z++) {
      for (let x = 11; x < 20; x++) {
        drawTile({ x, y: -1, z });
      }
    }

    console.log(minX);
    // drawStair({ x: 1, y: 0, z: 0 });
    // drawStair({ x: 2, y: -1, z: 0 });
    // drawTile({ x: 3, y: -2, z: 0 });

    const render = new Image(-minX + maxX, -minY + maxY);
    render.composite(image, -MARGIN - minX, -MARGIN - minY);
    return {
      status: 200,
      data: await render.encode(),
      headers: {
        "Content-Type": getContentType(".png"),
      },
    };
  },
};
