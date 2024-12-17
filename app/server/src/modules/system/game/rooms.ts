import {
  FindPathProps,
  Room,
  RoomFurniture,
  RoomMutable,
  User,
} from "shared/types/main.ts";
import { ProxyEvent, RoomPointEnum } from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";
import { getInterpolatedPath } from "shared/utils/pathfinding.utils.ts";
import { WALKABLE_FURNITURE_TYPE } from "shared/consts/main.ts";
import { Direction, getRandomNumber, isPoint3dEqual, Point3d } from "@oh/utils";
import { getRoomGridLayout } from "shared/utils/rooms.utils.ts";

export const rooms = () => {
  let roomUserMap: Record<string, string[]> = {};

  const $getRoom = (room: Room): RoomMutable => {
    let $room: Room = { ...room };

    if (!roomUserMap[room.id]) roomUserMap[room.id] = [];

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

    const addUser = async (user: User, position?: Point3d) => {
      const $user = System.game.users.get({ accountId: user.accountId });
      if (!$user) return;

      let startPosition = getSpawnPoint();
      if (position) {
        startPosition = { x: position.x, y: 0, z: position.z };
        startPosition.y = getYFromPoint(startPosition);
      }

      $user.setRoom(room.id);
      $user.setPosition(startPosition);
      $user.setBodyDirection(getSpawnDirection());

      //Add user to "room" internally
      System.proxy.$emit(ProxyEvent.$ADD_ROOM, {
        accountId: $user.getAccountId(),
        roomId: getId(),
      });

      //Load room to user
      $user.emit(ProxyEvent.LOAD_ROOM, {
        room: {
          ...getObject(),
          ownerUsername: await getOwnerUsername(),
        },
      });

      //Add user to room
      emit(ProxyEvent.ADD_HUMAN, { user: $user.getObject() });

      //Send every existing user inside room to the user
      for (const accountId of getUsers()) {
        const user = System.game.users.get({ accountId });
        if (!user) continue;

        $user.emit(ProxyEvent.ADD_HUMAN, {
          user: user.getObject(),
          isOld: true,
        });
      }

      roomUserMap[room.id].push($user.getAccountId());
    };
    const removeUser = (user: User, moveToAnotherRoom: boolean = false) => {
      const $user = System.game.users.get({ accountId: user.accountId });
      if (!$user) return;

      const $accountId = $user.getAccountId();

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
            !getFurnitures()
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
      const roomLayout = structuredClone(room.layout);
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
        roomLayout[position.z][position.x] = RoomPointEnum.EMPTY;
      }

      for (const furniture of getFurnitures()) {
        if (WALKABLE_FURNITURE_TYPE.includes(furniture.type)) continue;
        const position = furniture.position;
        if (isPoint3dEqual(start, position)) continue;

        //ignore if a human is in the same position of furniture because x (chairs, teleports, tp...)
        if (isPoint3dEqual(position, start)) continue;

        roomLayout[position.z][position.x] = RoomPointEnum.EMPTY;
      }

      const grid = getRoomGridLayout(roomLayout);

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

    const addFurniture = async (furniture: RoomFurniture) => {
      furniture.position = {
        ...furniture.position,
        y: getYFromPoint(furniture.position),
      };
      $room.furniture.push(furniture);

      await $save();
    };
    const removeFurniture = async (furniture: RoomFurniture) => {
      $room.furniture = $room.furniture.filter((f) => f.id !== furniture.id);

      await $save();
    };
    const getFurnitures = (): RoomFurniture[] => $room.furniture;

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

    const getObject = () => $room;

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
      await System.db.set(["rooms", $room.id], $room);
    };

    return {
      getId,
      getTitle,
      getDescription,

      getOwnerId,
      getOwnerUsername,

      addUser,
      removeUser,
      getUsers,

      getPoint,
      isPointFree,
      findPath,

      addFurniture,
      removeFurniture,
      getFurnitures,

      getObject,

      emit,
    };
  };

  const get = async (roomId: string): Promise<RoomMutable | null> => {
    try {
      const roomData = await System.db.get(["rooms", roomId]);
      if (!roomData) return null;
      return $getRoom(roomData);
    } catch (e) {
      return null;
    }
  };

  const getList = async (): Promise<RoomMutable[]> => {
    return (await System.db.list({ prefix: ["rooms"] })).map((item) =>
      $getRoom(item.value),
    );
  };

  const getRandom = async (): Promise<RoomMutable> => {
    const roomList = await getList();
    const roomIndex = getRandomNumber(0, roomList.length - 1);
    return roomList[roomIndex];
  };

  return {
    get,
    getList,

    getRandom,
  };
};
