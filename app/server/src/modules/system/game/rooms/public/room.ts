import {
  FindPathProps,
  RoomPoint,
  User,
  PublicRoomMutable,
  PublicRoom,
} from "shared/types/main.ts";
import { ProxyEvent, RoomPointEnum } from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";
import { getInterpolatedPath } from "shared/utils/pathfinding.utils.ts";
import { Direction, isPoint3dEqual, Point3d } from "@oh/utils";
import { Grid } from "@oh/pathfinding";
import { getBaseRoomGrid } from "shared/utils/rooms.utils.ts";

export const getRoom =
  (roomUserMap: Record<string, string[]>) =>
  (room: PublicRoom): PublicRoomMutable => {
    let $room: PublicRoom = { ...room };

    if (!roomUserMap[room.id]) roomUserMap[room.id] = [];

    const $baseRoomGrid: RoomPoint[][] = getBaseRoomGrid($room.layout);

    const getId = () => room.id;
    const getTitle = () => room.title;
    const getDescription = () => room.description;

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
        room: getObject(),
      });

      //Add user to room
      emit(ProxyEvent.ADD_HUMAN, { user: $user.getObject() });

      //Send every existing user inside room to the user
      for (const accountId of getUsers()) {
        const user = System.game.users.get({ accountId });
        if (!user) continue;

        $user.emit(ProxyEvent.ADD_HUMAN, {
          user: user.getObject(),
        });
      }

      roomUserMap[room.id].push($user.getAccountId());
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

    const isPointFree = (
      position: Point3d,
      props?: { accountId?: string; withoutSpawn?: boolean },
    ) => {
      if (getPoint(position) === RoomPointEnum.EMPTY) return false;
      if (!props?.withoutSpawn && getPoint(position) === RoomPointEnum.SPAWN)
        return true;

      return Boolean(
        !getUsers()
          .filter(
            ($accountId) =>
              !props?.accountId || $accountId !== props?.accountId,
          )
          .find(($accountId) => {
            const user = System.game.users.get({ accountId: $accountId });
            return isPoint3dEqual(user.getPosition(), position, true);
          }),
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

      //TODO add bots

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
      type: "public",
      ...$room,
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

    return {
      type: "public",

      getId,
      getTitle,
      getDescription,

      getYFromPoint,

      addUser,
      removeUser,
      getUsers,

      getPoint,
      isPointFree,
      findPath,

      //TODO
      getLayers: () => [],

      getObject,

      emit,
    };
  };
