import { System } from "modules/system/main.ts";
import { parse } from "@std/yaml";
import { RoomLayout } from "shared/types/room.types.ts";
import { CrossDirection, RoomPointEnum } from "shared/enums/main.ts";

const TILE_WIDTH = 2;
const TILE_Y_HEIGHT = 2;

const TEMP_SIZE = 512;
const MARGIN = 128;

const SCALE = 1;

export const layout = () => {
  let layoutImageCacheMap: Record<number, Uint8Array> = {};
  let layoutCacheMap: Record<number, RoomLayout> = {};

  const _getPositionFromIsometricPosition = ({ x, y, z }) => ({
    x: (x * TILE_WIDTH - z * TILE_WIDTH) * 2,
    y: z * TILE_WIDTH + x * TILE_WIDTH - y * TILE_Y_HEIGHT,
  });

  const _isWallRenderable = ({
    position: { x, z },
    layout,
    direction,
  }): boolean => {
    if (!layout[z]) return false;
    if (
      layout[z][x] === RoomPointEnum.SPAWN ||
      layout[z][x] === RoomPointEnum.EMPTY
    )
      return false;

    if (
      (direction === CrossDirection.EAST &&
        layout[z][x - 1] === RoomPointEnum.SPAWN) ||
      (direction === CrossDirection.NORTH &&
        layout[z - 1] &&
        layout[z - 1][x] === RoomPointEnum.SPAWN)
    )
      return false;

    for (let j = direction === CrossDirection.NORTH ? 1 : 0; j < z + 1; j++) {
      for (let i = direction === CrossDirection.NORTH ? 0 : 1; i < x + 1; i++) {
        const currentPoint = layout[z - j][x - i];
        if (!isNaN(parseInt(currentPoint))) return false;
      }
    }

    return true;
  };

  const _isDoorRenderable = ({ position: { x, z }, layout, direction }) => {
    if (direction === CrossDirection.NORTH)
      return layout[z - 1] && layout[z - 1][x] === RoomPointEnum.SPAWN;
    return layout[z][x - 1] === RoomPointEnum.SPAWN;
  };

  const get = async (layoutIndex: number): Promise<null | RoomLayout> => {
    if (layoutCacheMap[layoutIndex]) return layoutCacheMap[layoutIndex];

    const data = await System.db.get(["rooms", "layouts", layoutIndex]);
    if (!data) return null;

    layoutCacheMap[layoutIndex] = {
      id: layoutIndex,
      layout: data.layout,
      spawnPoint: data.spawnPoint,
      spawnDirection: data.spawnDirection,
    };
    return layoutCacheMap[layoutIndex];
  };

  const getList = async (): Promise<RoomLayout[]> => {
    return (await System.db.list({ prefix: ["rooms", "layouts"] })).items.map(
      ({ key, value }) => ({
        id: key[2],
        layout: value.layout,
        spawnPoint: value.spawnPoint,
        spawnDirection: value.spawnDirection,
      }),
    );
  };

  const getImage = async (layoutIndex: number): Promise<Uint8Array> => {
    if (layoutImageCacheMap[layoutIndex])
      return layoutImageCacheMap[layoutIndex];

    const layoutData = await get(layoutIndex);

    if (!layoutData) return null;

    const Image = System.image.getImage();

    const sprite = await Image.decode(
      await Deno.readFile("./assets/rooms/room-layout.png"),
    );

    const spriteSheet = parse(
      await Deno.readTextFile("./assets/rooms/room-layout.yml"),
    );

    const getData = (name: string) => {
      return spriteSheet[name];
    };
    const getTexture = (name: string) => {
      const { x, y, w, h } = getData(name);
      return sprite.clone().crop(x, y, w, h);
    };

    let list = [];

    const add = (texture: string, x: number, y: number, zIndex: number = 0) =>
      list.push([texture, x, y, zIndex]);

    const tempScene = new Image(TEMP_SIZE, TEMP_SIZE);

    {
      const { layout } = layoutData;
      const roomSize = {
        width: Math.max(...layout.map((line) => line.length)),
        depth: layout.length,
      };

      for (let z = 0; z < roomSize.depth; z++) {
        const roomLine = layout[z];
        for (let x = 0; x < roomSize.width; x++) {
          if (isNaN(roomLine[x] as number)) continue;

          const previewY = -(parseInt(roomLine[x] + "") ?? 0);
          const y = Math.floor(previewY);
          const renderNorthStairs = roomLine[x] > roomLine[x - 1];
          const renderEastStairs = roomLine[x] > layout[z - 1]?.[x];

          const stairsDirection = renderNorthStairs ? "north" : "east";

          const position = { x, y, z };

          const currentPosition = _getPositionFromIsometricPosition(position);
          const currentWallPosition = _getPositionFromIsometricPosition({
            ...position,
            y: 0,
          });

          if (renderNorthStairs || renderEastStairs)
            add(
              `${stairsDirection}-stairs`,
              currentPosition.x - (renderNorthStairs ? 1 : 0),
              currentPosition.y - 2,
              x + z,
            );
          else add(`tile`, currentPosition.x, currentPosition.y, x + z);

          const renderNorthWall = _isWallRenderable({
            layout,
            position: { x, z },
            direction: CrossDirection.EAST,
          });
          const renderEastWall = _isWallRenderable({
            layout,
            position: { x, z },
            direction: CrossDirection.NORTH,
          });
          const renderNorthDoorWall = _isDoorRenderable({
            layout,
            position: { x, z },
            direction: CrossDirection.EAST,
          });
          const renderEastDoorWall = _isDoorRenderable({
            layout,
            position: { x, z },
            direction: CrossDirection.NORTH,
          });

          if (renderNorthDoorWall) {
            add(
              `north-door`,
              currentWallPosition.x,
              currentWallPosition.y - 10,
              x + z + 2,
            );
          }

          if (renderEastDoorWall) {
            add(
              `east-door`,
              currentWallPosition.x + 3,
              currentWallPosition.y - 10,
              x + z + 2,
            );
          }

          if (renderNorthWall) {
            add(
              `north-wall-top`,
              currentWallPosition.x,
              currentWallPosition.y - 10,
              x + z,
            );
            for (let i = 0; i < Math.abs(y); i++) {
              add(
                `north-wall-bottom`,
                currentWallPosition.x,
                currentWallPosition.y - y - 1 - i,
                x + z,
              );
            }
          }
          if (renderEastWall) {
            add(
              `east-wall-top`,
              currentWallPosition.x + 3,
              currentWallPosition.y - 10,
              x + z,
            );
            for (let i = 0; i < Math.abs(y); i++) {
              add(
                `east-wall-bottom`,
                currentWallPosition.x + 3,
                currentWallPosition.y - y - 1 - i,
                x + z,
              );
            }
          }

          if (renderNorthWall && renderEastWall) {
            for (let i = 0; i < Math.abs(y) * TILE_Y_HEIGHT + 9; i++) {
              add(
                `wall-middle`,
                currentWallPosition.x + 3,
                currentWallPosition.y - 9 + i,
                x + z + 1,
              );
            }
          }
          if (
            !renderNorthWall &&
            !renderEastWall &&
            _isWallRenderable({
              layout,
              position: { x, z: z - 1 },
              direction: CrossDirection.EAST,
            }) &&
            _isWallRenderable({
              layout,
              position: { x: x - 1, z },
              direction: CrossDirection.NORTH,
            })
          ) {
            for (let i = 0; i < Math.abs(y) * TILE_Y_HEIGHT + 9; i++) {
              add(
                `wall-middle-reversed`,
                currentWallPosition.x + 3,
                currentWallPosition.y - 9 + i,
                x + z + 1,
              );
            }
          }
        }
      }
    }

    let minX = Number.MAX_SAFE_INTEGER;
    let maxX = Number.MIN_SAFE_INTEGER;

    let minY = Number.MAX_SAFE_INTEGER;
    let maxY = Number.MIN_SAFE_INTEGER;

    for (const [texture, x, y] of list.sort((a, b) => (a[3] > b[3] ? 1 : -1))) {
      const { w, h } = getData(texture);
      tempScene.composite(getTexture(texture), MARGIN + x, MARGIN + y);

      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x + w);

      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y + h);
    }

    const finalSize = {
      width: -minX + maxX,
      height: -minY + maxY,
    };

    const scene = new Image(finalSize.width, finalSize.height);
    scene.composite(tempScene, -MARGIN - minX, -MARGIN - minY);

    scene.resize(finalSize.width * SCALE, finalSize.height * SCALE);

    layoutImageCacheMap[layoutIndex] = await scene.encode();

    return layoutImageCacheMap[layoutIndex];
  };

  return {
    get,
    getList,
    getImage,
  };
};
