import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ContainerRef,
  FLEX_ALIGN,
  FlexContainerComponent,
} from "@openhotel/pixi-components";
import { TextComponent } from "shared/components";
import { HOT_BAR_HEIGHT_FULL, TEXT_BACKGROUND_BASE } from "shared/consts";
import { usePrivateRoom } from "shared/hooks";

export const RoomInfoComponent: React.FC = () => {
  const { room } = usePrivateRoom();

  const containerRef = useRef<ContainerRef>(null);

  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    setHeight(containerRef.current.getSize().height);
  }, [setHeight]);

  return useMemo(
    () => (
      <FlexContainerComponent
        ref={containerRef}
        pivot={{ y: HOT_BAR_HEIGHT_FULL + height + 5, x: -5 }}
        direction="y"
        align={FLEX_ALIGN.TOP}
      >
        <TextComponent text={room.title} {...TEXT_BACKGROUND_BASE} />
        {room.description ? (
          <TextComponent
            alpha={0.6}
            text={room.description}
            {...TEXT_BACKGROUND_BASE}
          />
        ) : null}
        {room.ownerUsername ? (
          <TextComponent
            alpha={0.6}
            text={`by ${room.ownerUsername}`}
            {...TEXT_BACKGROUND_BASE}
          />
        ) : null}
      </FlexContainerComponent>
    ),
    [room, height],
  );
};
