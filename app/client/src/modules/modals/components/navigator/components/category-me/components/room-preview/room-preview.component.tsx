import React, { useEffect, useMemo, useState } from "react";
import {
  ContainerComponent,
  ContainerProps,
  FLEX_ALIGN,
  FLEX_JUSTIFY,
  FlexContainerComponent,
  NineSliceSpriteComponent,
  Size,
  SpriteComponent,
  useTextures,
} from "@openhotel/pixi-components";
import { SpriteSheetEnum, TextureEnum } from "shared/enums";
import { NavigatorRoom } from "shared/types";
import {
  ButtonComponent,
  SoftBadgeComponent,
  TextComponent,
} from "shared/components";
import { useApiPath } from "shared/hooks";
import { useTranslation } from "react-i18next";

type Props = {
  size: Size;
  room: NavigatorRoom;
  onJoin: () => void;
} & ContainerProps;

export const RoomPreviewComponent: React.FC<Props> = ({
  size,
  room,
  onJoin,
  ...containerProps
}) => {
  const { t } = useTranslation();
  const { getPath } = useApiPath();
  const { loadTexture } = useTextures();

  const [$texture, $setTexture] = useState<string>(TextureEnum.ROOM_PREVIEW);

  const previewUrl = useMemo(
    () => getPath(`/capture?id=${room.id}`),
    [room, getPath],
  );

  useEffect(() => {
    $setTexture(TextureEnum.ROOM_PREVIEW);
    loadTexture(previewUrl).then(() => $setTexture(previewUrl));
  }, [loadTexture, $setTexture, previewUrl]);

  return (
    <ContainerComponent {...containerProps}>
      <SpriteComponent
        texture={$texture}
        position={{
          x: 1,
          y: 1,
        }}
      />
      <NineSliceSpriteComponent
        spriteSheet={SpriteSheetEnum.UI}
        texture="preview-image-border"
        leftWidth={4}
        rightWidth={4}
        topHeight={4}
        bottomHeight={4}
        width={size.width}
        height={size.width}
      />
      <ContainerComponent
        position={{
          y: size.width + 5,
        }}
      >
        <ContainerComponent position={{ x: 5 }}>
          <TextComponent text={room.title} bold color={0} />
          {room?.description ? (
            <TextComponent
              text={room?.description}
              color={0}
              maxWidth={size.width - 10}
              position={{
                y: 10,
              }}
            />
          ) : null}
        </ContainerComponent>
      </ContainerComponent>
      <ContainerComponent position={{ y: size.height - 20 }}>
        <SoftBadgeComponent
          size={{
            width: size.width,
            height: 20,
          }}
        />
        <FlexContainerComponent
          size={{
            width: size.width - 3,
            height: 20,
          }}
          justify={FLEX_JUSTIFY.END}
          align={FLEX_ALIGN.CENTER}
          gap={6}
        >
          <TextComponent text={`${room.users}/${room.maxUsers}`} color={0} />
          <ButtonComponent
            size={{
              height: 14,
            }}
            autoWidth={true}
            text={t("navigator.join")}
            onPointerDown={onJoin}
          />
        </FlexContainerComponent>
      </ContainerComponent>
    </ContainerComponent>
  );
};
