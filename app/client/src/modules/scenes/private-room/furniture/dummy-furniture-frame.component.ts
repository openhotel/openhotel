import {
  component,
  ContainerComponent,
  Cursor,
  EventMode,
  sprite,
  SpriteMutable,
} from "@tu/tulip";
import { FurnitureDirectionData, Point2d, Point3d } from "shared/types";
import { TILE_SIZE } from "shared/consts";
import { CrossDirection } from "shared/enums";
import { getPositionFromIsometricPosition } from "shared/utils";
import { DUMMY_FURNITURE_FRAME_DATA } from "shared/consts/furniture.consts";

type Props = {
  point: Point3d;
  framePosition: Point2d;
  direction: CrossDirection;
};

type Mutable = {
  getSpriteList: () => SpriteMutable[];
};

export const dummyFurnitureFrameComponent: ContainerComponent<
  Props,
  Mutable
> = (props) => {
  const $component = component<Props, Mutable>(props);

  const { point, framePosition, direction } = $component.getProps();

  const furnitureDirectionData = DUMMY_FURNITURE_FRAME_DATA.direction[
    direction
  ] as FurnitureDirectionData;

  const positionZIndex = point.x + point.z - point.y;

  const { texture, bounds, zIndex, hitArea } =
    furnitureDirectionData.textures[0];

  const isNorthDirection = direction === CrossDirection.NORTH;

  const $position = getPositionFromIsometricPosition(point);
  const frameIsometricPosition = {
    x: (isNorthDirection ? -framePosition.x : framePosition.x) * 2,
    y: framePosition.x - framePosition.y,
  };

  const $sprite = sprite({
    spriteSheet: DUMMY_FURNITURE_FRAME_DATA.spriteSheet,
    texture,
    position: {
      x: $position.x + frameIsometricPosition.x,
      y: $position.y + frameIsometricPosition.y,
    },
    zIndex: positionZIndex + zIndex - 0.2,
    pivot: {
      x: -TILE_SIZE.width / 2 + bounds.width / 2,
      y: bounds.height / 2,
    },
    eventMode: EventMode.STATIC,
    cursor: Cursor.POINTER,
    hitArea,
  });

  return $component.getComponent(dummyFurnitureFrameComponent, {
    getSpriteList: () => [$sprite],
  });
};
