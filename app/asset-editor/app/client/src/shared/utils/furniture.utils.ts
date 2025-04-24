import { FurnitureData, SpriteSheet } from "shared/types";
import {
  FurnitureActionType,
  FurnitureDirection,
  FurnitureType,
} from "shared/enums";
import { ulid } from "ulidx";

export const parseFurniture = (
  $furniture: Partial<FurnitureData>,
  sheet: SpriteSheet,
): FurnitureData => {
  const furniture = structuredClone($furniture);

  const furnitureTypes = Object.values(FurnitureType);
  const actionTypes = Object.values(FurnitureActionType);

  if (!furniture?.type || !furnitureTypes.includes(furniture?.type))
    furniture.type = FurnitureType.FURNITURE;

  const parseDirection = (furnitureDirection: FurnitureDirection) => ({
    textures:
      furniture?.direction?.[furnitureDirection]?.textures
        ?.map(({ texture, bounds, pivot, position, zIndex }) => ({
          texture: sheet.frames[texture] ? texture : null,
          bounds: {
            width: bounds?.width ?? 0,
            height: bounds?.height ?? 0,
          },
          pivot: {
            x: pivot?.x ?? 0,
            y: pivot?.y ?? 0,
          },
          position: {
            x: position?.x ?? 0,
            z: position?.z ?? 0,
          },
          zIndex: zIndex ?? 0,
        }))
        .filter((texture) => texture.texture) ?? [],
  });

  // console.log(
  //   furniture?.actions
  //     ?.map((action) => ({
  //       type: actionTypes.includes(action.type) ? action.type : null,
  //       meta: action.meta,
  //     }))
  //     .filter((action) => !action.type) ?? [],
  // );

  return {
    id: furniture?.id ?? "",
    type: furniture.type,
    revision: ulid(),
    icon: {
      texture: furniture?.icon?.texture ?? "",
      bounds: {
        width: furniture?.icon?.bounds?.width ?? 0,
        height: furniture?.icon?.bounds?.height ?? 0,
      },
    },
    size: {
      width: furniture?.size?.width ?? 0,
      height: furniture?.size?.height ?? 0,
      depth:
        furniture.type === FurnitureType.FURNITURE
          ? furniture?.size?.depth ?? 0
          : 0,
    },
    direction: {
      [FurnitureDirection.NORTH]: parseDirection(FurnitureDirection.NORTH),
      [FurnitureDirection.EAST]: parseDirection(FurnitureDirection.EAST),
      ...(furniture.type === FurnitureType.FURNITURE
        ? {
            [FurnitureDirection.SOUTH]: parseDirection(
              FurnitureDirection.SOUTH,
            ),
            [FurnitureDirection.WEST]: parseDirection(FurnitureDirection.WEST),
          }
        : {}),
    },
    actions:
      furniture?.actions
        ?.map((action) => (actionTypes.includes(action.type) ? action : null))
        .filter((action) => Boolean(action.type)) ?? [],
  };
};
