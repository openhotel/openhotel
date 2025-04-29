import React, { useMemo } from "react";
import {
  ContainerComponent,
  ContainerProps,
  Cursor,
  EventMode,
  FLEX_ALIGN,
  FLEX_JUSTIFY,
  FlexContainerComponent,
  NineSliceSpriteComponent,
  Size,
  SpriteComponent,
} from "@openhotel/pixi-components";
import { SpriteSheetEnum } from "shared/enums";
import { TextComponent } from "shared/components/text";

type Props = {
  title: string;
  favorite: boolean;
  users: number;
  maxUsers: number;
  size: Size;

  onClickFavorite: () => void;
  onClickGo: () => void;
} & ContainerProps;

export const NavigatorRoomButtonComponent: React.FC<Props> = ({
  title,
  favorite,
  users,
  maxUsers,
  size,

  onClickFavorite,
  onClickGo,
  ...containerProps
}) => {
  const usersWidth = 40;

  const usersColor = useMemo(() => {
    if (users >= maxUsers) return 0xb73d22;
    if (users >= maxUsers - 5) return 0xffd826;
    if (users > 0) return 0x87c053;

    return 0xe0e0e0;
  }, [users, maxUsers]);

  return (
    <ContainerComponent
      {...containerProps}
      eventMode={EventMode.STATIC}
      cursor={Cursor.POINTER}
    >
      <NineSliceSpriteComponent
        spriteSheet={SpriteSheetEnum.UI}
        texture="ui-button-left-slice"
        leftWidth={3}
        rightWidth={3}
        topHeight={3}
        bottomHeight={3}
        width={size.width - usersWidth}
        height={size.height}
      />
      <ContainerComponent
        position={{
          x: 8,
          y: size.height / 2 - 4,
        }}
      >
        <SpriteComponent
          spriteSheet={SpriteSheetEnum.UI}
          texture={favorite ? "heart-full" : "heart-empty"}
          eventMode={EventMode.STATIC}
          cursor={Cursor.POINTER}
          onPointerDown={onClickFavorite}
        />
        <TextComponent
          text={title}
          color={0x1}
          maxWidth={size.width - usersWidth - 28}
          wrap={false}
          position={{
            x: 15,
            y: 1,
          }}
        />
      </ContainerComponent>
      <ContainerComponent
        position={{
          x: size.width - usersWidth,
        }}
        eventMode={EventMode.STATIC}
        cursor={Cursor.POINTER}
        onPointerDown={onClickGo}
      >
        <NineSliceSpriteComponent
          spriteSheet={SpriteSheetEnum.UI}
          texture="ui-button-right-slice"
          leftWidth={4}
          rightWidth={4}
          topHeight={4}
          bottomHeight={4}
          width={usersWidth}
          height={size.height}
          tint={usersColor}
        />
        <FlexContainerComponent
          size={{ width: usersWidth - 8, height: size.height }}
          justify={FLEX_JUSTIFY.CENTER}
          align={FLEX_ALIGN.CENTER}
        >
          <TextComponent
            text={users + ""}
            pivot={{
              x: -2,
            }}
            bold
          />
        </FlexContainerComponent>
        <FlexContainerComponent
          size={{ width: usersWidth - 8, height: size.height }}
          align={FLEX_ALIGN.CENTER}
          position={{
            x: usersWidth - 7,
          }}
        >
          <SpriteComponent
            spriteSheet={SpriteSheetEnum.UI}
            texture="arrow"
            pivot={{
              y: 1,
            }}
          />
        </FlexContainerComponent>
      </ContainerComponent>
    </ContainerComponent>
  );
};
