import {
  FindPathProps,
  PrivateRoom,
  PrivateRoomMutable,
  RoomFurniture,
  RoomPoint,
  User,
} from "shared/types/main.ts";
import { FurnitureType, ProxyEvent, RoomPointEnum } from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";
import { getInterpolatedPath } from "shared/utils/pathfinding.utils.ts";
import {
  TILE_Y_HEIGHT,
  WALKABLE_FURNITURE_TYPE,
  WALL_HEIGHT,
} from "shared/consts/main.ts";
import {
  Direction,
  getRandomNumber,
  isPoint3dEqual,
  Point2d,
  Point3d,
} from "@oh/utils";
import { Grid } from "@oh/pathfinding";
import { getBaseRoomGrid } from "shared/utils/rooms.utils.ts";
import { getPositionFromIsometricPosition } from "shared/utils/position.utils.ts";

export const getRoom =
  (roomUserMap: Record<string, string[]>) =>
  async (room: PrivateRoom): Promise<PrivateRoomMutable> => {
    let $room: PrivateRoom = { ...room };

    if (!roomUserMap[room.id]) roomUserMap[room.id] = [];

    const { layout, spawnPoint, spawnDirection } =
      await System.game.rooms.layout.get($room.layoutIndex);

    const $baseRoomGrid: RoomPoint[][] = getBaseRoomGrid(layout);

    const getId = () => room.id;
    const getTitle = () => room.title;
    const getDescription = () => room.description;

    const getOwnerId = () => $room.ownerId;
    const getOwnerUsername = async (): Promise<string | null> => {
      const user = await System.game.users.getCacheUser(getOwnerId());
      if (!user) return null;
      return user.username;
    };

    const getSpawnPoint = (): Point3d => spawnPoint;
    const getSpawnDirection = (): Direction => spawnDirection;

    const mapUser = (user: User) => ({
      accountId: user.accountId,
      username: user.username,
      position: user.position,
      positionUpdatedAt: user.positionUpdatedAt,
      bodyDirection: user.bodyDirection,
    });

    const addUser = async (user: User, position?: Point3d) => {
      const $user = System.game.users.get({ accountId: user.accountId });
      if (!$user) return;

      let startPosition = getSpawnPoint();
      if (position) {
        startPosition = { x: position.x, y: 0, z: position.z };
        startPosition.y = getYFromPoint(startPosition);
      }

      $user.setPosition(startPosition);
      $user.setBodyDirection(getSpawnDirection());

      //Add user to room
      emit(ProxyEvent.ADD_HUMAN, { user: mapUser($user.getObject()) });

      roomUserMap[room.id].push($user.getAccountId());

      //Load room to user
      $user.emit(ProxyEvent.LOAD_ROOM, {
        room: await getObjectWithUsers(),
      });

      $user.setRoom(room.id);
      //Add user to "room" internally
      System.proxy.$emit(ProxyEvent.$ADD_ROOM, {
        accountId: $user.getAccountId(),
        roomId: getId(),
      });

      const randomPoint =
        getFurniture()
          .filter((furniture) => furniture.type === FurnitureType.FURNITURE)
          .sort(() => 0.5 + Math.random())[0]?.position ?? getRandomPoint();
      // Make capture
      const pos = getPositionFromIsometricPosition({
        ...randomPoint,
        y: getYFromPoint(randomPoint),
      });

      System.phantom.capture({
        id: room.id,
        room: getObject(),
        size: {
          width: 128,
          height: 128,
        },
        position: {
          x: -pos.x + 64,
          y: -pos.y + 64,
        },
        pivotFix: false,
      });
    };
    const removeUser = (user: User, moveToAnotherRoom: boolean = false) => {
      const $user = System.game.users.get({ accountId: user.accountId });
      if (!$user) return;

      const $accountId = $user.getAccountId();

      System.game.rooms.pathfinding.remove(user.accountId);

      roomUserMap[room.id] = roomUserMap[room.id].filter(
        (accountId) => accountId !== $accountId,
      );

      $user.removeRoom();

      //Remove user from internal "room"
      System.proxy.$emit(ProxyEvent.$REMOVE_ROOM, {
        accountId: $accountId,
        roomId: room.id,
      });
      //Disconnect user from current room
      $user.emit(ProxyEvent.LEAVE_ROOM, { moveToAnotherRoom });
      //Remove user human from the room to existing users
      emit(ProxyEvent.REMOVE_HUMAN, { accountId: $user.getAccountId() });
    };
    const getUsers = () => roomUserMap[room.id];

    const getRandomPoint = (): Point2d => {
      const z = getRandomNumber(0, layout.length - 1);
      const x = getRandomNumber(0, layout[z].length - 1);
      if (layout[z][x] === undefined) return getRandomPoint();
      return { x, z };
    };

    const getPoint = (position: Point3d) => layout?.[position.z]?.[position.x];

    const isPointFree = (
      position: Point3d,
      props?: { accountId?: string; withoutSpawn?: boolean },
    ) => {
      if (getPoint(position) === RoomPointEnum.EMPTY) return false;
      if (getPoint(position) === RoomPointEnum.SPAWN) return true;

      return Boolean(
        !getUsers()
          .filter(
            ($accountId) => !props?.accountId || $accountId !== props.accountId,
          )
          .find(($accountId) => {
            const user = System.game.users.get({ accountId: $accountId });
            return isPoint3dEqual(user.getPosition(), position, true);
          }) &&
          Boolean(
            !getFurniture()
              .filter(
                (furniture) =>
                  !WALKABLE_FURNITURE_TYPE.includes(furniture.type),
              )
              .find((furniture) =>
                isPoint3dEqual(furniture.position, position),
              ),
          ),
      );
    };

    const findPath = ({ start, end, accountId }: FindPathProps) => {
      const roomLayout = structuredClone($baseRoomGrid);
      const roomUsers = getUsers().map(($accountId) =>
        System.game.users.get({ accountId: $accountId }),
      );

      for (const user of roomUsers) {
        if (!user) continue;
        //ignore current user
        if (accountId && user?.getAccountId() === accountId) continue;

        const position = user.getPosition();

        //ignore if a human is in the same position of you because x (teleports, tp...)
        if (isPoint3dEqual(position, start)) continue;

        //if spawn, ignore
        if (getPoint(position) === RoomPointEnum.SPAWN) continue;

        //if is occupied, set as empty
        roomLayout[position.z][position.x] = 0;
      }

      for (const furniture of getFurniture()) {
        if (WALKABLE_FURNITURE_TYPE.includes(furniture.type)) continue;
        const position = furniture.position;
        //ignore if a human is in the same position of furniture because x (chairs, teleports, tp...)
        if (isPoint3dEqual(position, start)) continue;

        roomLayout[position.z][position.x] = 0;
      }

      const grid = Grid.from(roomLayout);

      const path = grid
        .findPath(
          { x: start.x, y: start.z },
          { x: end.x, y: end.z },
          { maxJumpCost: 5, jumpBlockedDiagonals: true },
        )
        .map(({ x, y }) => ({
          x,
          z: y,
        }));

      const pathfinding = getInterpolatedPath(path).map(({ x, z }) => ({
        x,
        y: getYFromPoint({ x, z }),
        z,
      }));
      //discard first (current position)
      pathfinding.shift();
      return pathfinding;
    };

    const getFurnitureYPosition = async (
      position: Point3d,
      furnitureType: FurnitureType,
      currentId?: string,
    ): Promise<number | null> => {
      const baseY = getYFromPoint(position) * TILE_Y_HEIGHT;
      if (furnitureType === FurnitureType.FRAME) return baseY;

      const pointFurnitureList = getFurnitureFromPoint(
        position,
        FurnitureType.FURNITURE,
      ).filter((furniture) => !currentId || furniture.id !== currentId);

      const pointFurnitureDataList = await Promise.all(
        [
          ...new Set(
            pointFurnitureList.map((furniture) => furniture.furnitureId),
          ),
        ].map(System.game.furniture.get),
      );
      const targetY = pointFurnitureList.reduce(
        (y, furniture) =>
          Math.max(
            y,
            furniture.position.y +
              (pointFurnitureDataList.find(
                ($furniture) => $furniture.id === furniture.furnitureId,
              )?.size?.height ?? 0),
          ),
        baseY,
      );
      if (targetY > WALL_HEIGHT) return null;

      return targetY;
    };

    const addFurniture = async (furniture: RoomFurniture) => {
      furniture.position.y = await getFurnitureYPosition(
        furniture.position,
        furniture.type,
      );
      if (furniture.position.y === null) return;

      $room.furniture.push(furniture);

      await $save();

      emit(ProxyEvent.ADD_FURNITURE, {
        furniture,
      });
    };
    const updateFurniture = async (furniture: RoomFurniture) => {
      furniture.position.y = await getFurnitureYPosition(
        furniture.position,
        furniture.type,
        furniture.id,
      );

      if (furniture.position.y === null) return;

      $room.furniture = $room.furniture.map(($furniture) =>
        furniture.id === $furniture.id ? furniture : $furniture,
      );

      await $save();
      emit(ProxyEvent.UPDATE_FURNITURE, {
        furniture,
      });
    };
    const removeFurniture = async (furniture: RoomFurniture) => {
      $room.furniture = $room.furniture.filter((f) => f.id !== furniture.id);

      //TODO Add teleport logic here!
      // await System.game.teleports.removeRoom(furniture.id);

      await $save();
      emit(ProxyEvent.REMOVE_FURNITURE, {
        furniture,
      });
    };
    const removeAllFurniture = async () => {
      emit(ProxyEvent.REMOVE_FURNITURE, {
        furniture: $room.furniture,
      });
      $room.furniture = [];
      await $save();
    };
    const getFurniture = (): RoomFurniture[] => $room.furniture;

    const getFurnitureFromPoint = (
      point: Omit<Point3d, "y">,
      type: FurnitureType = null,
    ): RoomFurniture[] =>
      $room.furniture.filter(
        (furniture) =>
          furniture.position.x === point.x &&
          furniture.position.z === point.z &&
          (type === null || type === furniture.type),
      );

    const getYFromPoint = (point: Partial<Point3d>): number | null => {
      if (!layout?.[point.z]) return null;
      const roomPoint = layout?.[point.z]?.[point.x];

      if (roomPoint === RoomPointEnum.EMPTY) return null;
      if (roomPoint === RoomPointEnum.SPAWN) return 0;

      const onStairs =
        layout?.[point.z] &&
        (roomPoint > layout?.[point.z]?.[point.x - 1] ||
          roomPoint > layout?.[point.z - 1]?.[point.x]);

      return -(parseInt(roomPoint + "") - 1) + (onStairs ? 0.5 : 0);
    };

    const getLayout = () => layout;

    const getObject = () => ({
      type: "private",
      ...$room,
      layout: getLayout(),
    });

    const getObjectWithUsers = async () => ({
      ...getObject(),
      users: getUsers()
        .map((accountId) => System.game.users.get({ accountId })?.getObject?.())
        .filter(Boolean)
        .map(mapUser),
      ownerUsername: await getOwnerUsername(),
    });

    const remove = async () => {
      await System.db.delete(["rooms", "private", $room.id]);
      roomUserMap[room.id] = [];
    };

    const emit = <Data extends any>(
      event: ProxyEvent,
      data: Data = {} as Data,
    ) =>
      System.proxy.emitRoom({
        event,
        roomId: getId(),
        data,
      });

    const $save = async () => {
      $room.updatedAt = Date.now();
      await System.db.set(["rooms", "private", $room.id], $room);
    };

    return {
      type: "private",

      getId,
      getTitle,
      getDescription,

      getOwnerId,
      getOwnerUsername,

      getYFromPoint,

      addUser,
      removeUser,
      getUsers,

      getPoint,
      isPointFree,
      findPath,

      getLayout,

      addFurniture,
      updateFurniture,
      removeFurniture,
      removeAllFurniture,

      getFurniture,
      getFurnitureFromPoint,
      getFurnitureYPosition,

      getObject,
      getObjectWithUsers,

      remove,

      emit,
    };
  };
