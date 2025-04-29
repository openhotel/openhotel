import {
  FindPathProps,
  PrivateRoom,
  RoomFurniture,
  PrivateRoomMutable,
  RoomPoint,
  User,
} from "shared/types/main.ts";
import { FurnitureType, ProxyEvent, RoomPointEnum } from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";
import { getInterpolatedPath } from "shared/utils/pathfinding.utils.ts";
import { WALKABLE_FURNITURE_TYPE, TILE_Y_HEIGHT } from "shared/consts/main.ts";
import { Direction, isPoint3dEqual, Point3d } from "@oh/utils";
import { Grid } from "@oh/pathfinding";
import { getBaseRoomGrid } from "shared/utils/rooms.utils.ts";

export const getRoom =
  (roomUserMap: Record<string, string[]>) =>
  (room: PrivateRoom): PrivateRoomMutable => {
    let $room: PrivateRoom = { ...room };

    if (!roomUserMap[room.id]) roomUserMap[room.id] = [];

    const $baseRoomGrid: RoomPoint[][] = getBaseRoomGrid($room.layout);

    const getId = () => room.id;
    const getTitle = () => room.title;
    const getDescription = () => room.description;

    const getOwnerId = () => $room.ownerId;
    const getOwnerUsername = async (): Promise<string | null> => {
      const user = await System.game.users.getCacheUser(getOwnerId());
      if (!user) return null;
      return user.username;
    };

    const getSpawnPoint = (): Point3d => room.spawnPoint;
    const getSpawnDirection = (): Direction => room.spawnDirection;

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
    };
    const removeUser = (user: User, moveToAnotherRoom: boolean = false) => {
      const $user = System.game.users.get({ accountId: user.accountId });
      if (!$user) return;

      const $accountId = $user.getAccountId();

      System.game.rooms.pathfinding.remove(user.accountId);

      $user.removeRoom();

      roomUserMap[room.id] = roomUserMap[room.id].filter(
        (accountId) => accountId !== $accountId,
      );

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

    const getPoint = (position: Point3d) =>
      room.layout?.[position.z]?.[position.x];

    const isPointFree = (position: Point3d, accountId?: string) => {
      if (getPoint(position) === RoomPointEnum.EMPTY) return false;
      if (getPoint(position) === RoomPointEnum.SPAWN) return true;

      return Boolean(
        !getUsers()
          .filter(($accountId) => !accountId || $accountId !== accountId)
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

    const $getFurnitureYPosition = async (
      position: Point3d,
    ): Promise<number> => {
      const pointFurnitureList = getFurnitureFromPoint(position);
      const pointFurnitureDataList = await Promise.all(
        [
          ...new Set(
            pointFurnitureList.map((furniture) => furniture.furnitureId),
          ),
        ].map(System.game.furniture.get),
      );
      return pointFurnitureList.reduce(
        (y, furniture) =>
          Math.max(
            y,
            furniture.position.y +
              (pointFurnitureDataList.find(
                ($furniture) => $furniture.id === furniture.furnitureId,
              )?.size?.height ?? 0),
          ),
        getYFromPoint(position) * TILE_Y_HEIGHT,
      );
    };

    const addFurniture = async (furniture: RoomFurniture) => {
      furniture.position.y = await $getFurnitureYPosition(furniture.position);
      $room.furniture.push(furniture);

      await $save();
    };
    const updateFurniture = async (furniture: RoomFurniture) => {
      furniture.position.y = await $getFurnitureYPosition(furniture.position);
      $room.furniture = $room.furniture.map(($furniture) =>
        furniture.id === $furniture.id ? furniture : $furniture,
      );

      await $save();
    };
    const removeFurniture = async (furniture: RoomFurniture) => {
      $room.furniture = $room.furniture.filter((f) => f.id !== furniture.id);

      if (furniture.type === FurnitureType.TELEPORT)
        await System.game.teleports.removeRoom(furniture.id);

      await $save();
    };
    const getFurniture = (): RoomFurniture[] => $room.furniture;

    const getFurnitureFromPoint = (
      point: Omit<Point3d, "y">,
    ): RoomFurniture[] =>
      $room.furniture.filter(
        (furniture) =>
          furniture.position.x === point.x && furniture.position.z === point.z,
      );

    const getYFromPoint = (point: Partial<Point3d>): number | null => {
      if (!room?.layout?.[point.z]) return null;
      const roomPoint = room.layout?.[point.z]?.[point.x];

      if (roomPoint === RoomPointEnum.EMPTY) return null;
      if (roomPoint === RoomPointEnum.SPAWN) return 0;

      const onStairs =
        room?.layout?.[point.z] &&
        (roomPoint > room?.layout?.[point.z]?.[point.x - 1] ||
          roomPoint > room?.layout?.[point.z - 1]?.[point.x]);

      return -(parseInt(roomPoint + "") - 1) + (onStairs ? 0.5 : 0);
    };

    const getObject = () => ({
      type: "private",
      ...$room,
    });

    const getObjectWithUsers = async () => ({
      ...getObject(),
      users: getUsers()
        .map((accountId) => System.game.users.get({ accountId }).getObject())
        .map(mapUser),
      ownerUsername: await getOwnerUsername(),
    });

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

      addFurniture,
      updateFurniture,
      removeFurniture,
      getFurniture,
      getFurnitureFromPoint,

      getObject,
      getObjectWithUsers,

      emit,
    };
  };
