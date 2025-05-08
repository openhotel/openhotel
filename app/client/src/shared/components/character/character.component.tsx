import React, { useMemo } from "react";
import {
  ContainerComponent,
  ContainerProps,
  Cursor,
  EventMode,
  GraphicsComponent,
  GraphicType,
  SpriteComponent,
} from "@openhotel/pixi-components";
import {
  CharacterArmAction,
  CharacterArmSide,
  CharacterBodyAction,
  Direction,
  SpriteSheetEnum,
} from "shared/enums";
import { SAFE_Z_INDEX, TILE_SIZE } from "shared/consts";
import { ArmComponent, BodyComponent, HeadComponent } from "./components";
import { getCubePolygon } from "shared/utils/polygon.utils";

type Props = {
  bodyAction: CharacterBodyAction;
  bodyDirection: Direction;
  headDirection: Direction;
  leftArmAction: CharacterArmAction;
  rightArmAction: CharacterArmAction;
  skinColor: number;

  speaking?: boolean;
} & ContainerProps;

export const CharacterComponent: React.FC<Props> = ({
  bodyAction,
  bodyDirection,
  headDirection,
  leftArmAction,
  rightArmAction,
  skinColor,

  speaking = false,

  position,
  zIndex = 0,

  onPointerDown,
  ...containerProps
}) => {
  const $pivot = useMemo(
    () => ({
      x: -(TILE_SIZE.width + 2) / 2,
      y: -TILE_SIZE.height / 2,
    }),
    [],
  );

  const renderHitbox = useMemo(
    () => (
      <GraphicsComponent
        type={GraphicType.POLYGON}
        tint={0x00ffff}
        alpha={0}
        polygon={getCubePolygon({ width: 26, height: 65 })}
        eventMode={EventMode.STATIC}
        cursor={Cursor.CROSSHAIR}
        zIndex={zIndex + SAFE_Z_INDEX}
        position={position}
        pivot={{
          x: -11,
          y: -6,
        }}
        onPointerDown={onPointerDown}
      />
    ),
    [onPointerDown, zIndex, position],
  );

  const renderLeftArm = useMemo(
    () => (
      <ArmComponent
        skinColor={skinColor}
        bodyDirection={bodyDirection}
        bodyAction={bodyAction}
        side={CharacterArmSide.LEFT}
        action={leftArmAction}
      />
    ),
    [skinColor, bodyDirection, bodyAction, leftArmAction],
  );

  const renderRightArm = useMemo(
    () => (
      <ArmComponent
        skinColor={skinColor}
        bodyDirection={bodyDirection}
        bodyAction={bodyAction}
        side={CharacterArmSide.RIGHT}
        action={leftArmAction}
      />
    ),
    [skinColor, bodyDirection, bodyAction, rightArmAction],
  );

  const renderHead = useMemo(
    () => (
      <HeadComponent
        skinColor={skinColor}
        bodyDirection={bodyDirection}
        bodyAction={bodyAction}
        direction={headDirection}
      />
    ),
    [skinColor, bodyDirection, bodyAction, headDirection],
  );

  const renderBody = useMemo(
    () => (
      <BodyComponent
        action={bodyAction}
        direction={bodyDirection}
        skinColor={skinColor}
      >
        {renderHead}
        {renderLeftArm}
        {renderRightArm}
      </BodyComponent>
    ),
    [
      bodyAction,
      bodyDirection,
      skinColor,
      renderHead,
      renderLeftArm,
      renderRightArm,
    ],
  );

  const renderCharacter = useMemo(
    () => (
      <ContainerComponent
        pivot={$pivot}
        zIndex={zIndex}
        position={position}
        {...containerProps}
      >
        {renderBody}
      </ContainerComponent>
    ),
    [$pivot, zIndex, position, containerProps, renderBody],
  );
  const renderShadow = useMemo(
    () => (
      <SpriteComponent
        spriteSheet={SpriteSheetEnum.CHARACTER}
        texture="shadow"
        pivot={{
          x: -11,
          y: -6,
        }}
        alpha={0.2}
        tint={0}
        position={position}
        zIndex={zIndex - 0.1}
      />
    ),
    [position, zIndex],
  );

  return useMemo(
    () => (
      <React.Fragment>
        {renderHitbox}
        {renderCharacter}
        {renderShadow}
      </React.Fragment>
    ),
    [renderHitbox, renderCharacter],
  );
};
