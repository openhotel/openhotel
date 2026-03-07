import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ContainerComponent,
  ContainerRef,
  Event,
  GraphicsComponent,
  GraphicType,
  Size,
  useEvents,
  useWindow,
} from "@openhotel/pixi-components";
import { useRoom, useSafeWindow } from "shared/hooks";
import { PrivateRoom } from "shared/types";
import { CameraComponent } from "shared/components";
import { HOT_BAR_HEIGHT_FULL } from "shared/consts";
import {
  ChatHotBarComponent,
  RoomInfoComponent,
  SelectionPreviewComponent,
} from "modules/private-room";
import { InternalEvent } from "shared/enums";

export const PublicRoomComponent: React.FC = () => {
  const publicRoomRef = useRef<ContainerRef>(null);

  const { room } = useRoom<PrivateRoom>();
  const { getSize } = useWindow();
  const { getSafeSize } = useSafeWindow();
  const { on: onEvent } = useEvents();

  const [windowSize, setWindowSize] = useState<Size>(getSize());
  const [safeWindowSize, setSafeWindowSize] = useState<Size>(getSafeSize());

  const safeXPosition = useMemo(
    () => Math.round((windowSize.width - safeWindowSize.width) / 2),
    [windowSize, safeWindowSize],
  );

  useEffect(() => {
    if (!room) return;

    const onRemoveOnResize = onEvent(Event.RESIZE, setWindowSize);
    const onRemoveOnSafeResize = onEvent(
      InternalEvent.SAFE_RESIZE,
      setSafeWindowSize,
    );
    setWindowSize(getSize());

    return () => {
      onRemoveOnResize();
      onRemoveOnSafeResize();
    };
  }, [onEvent, room?.id]);

  return useMemo(
    () =>
      room ? (
        <ContainerComponent>
          <CameraComponent
            contentRef={publicRoomRef}
            margin={50}
            bottomPadding={HOT_BAR_HEIGHT_FULL}
          >
            <GraphicsComponent
              type={GraphicType.RECTANGLE}
              width={50}
              height={50}
              alpha={0.5}
            />
          </CameraComponent>
          <ContainerComponent
            position={{
              x: safeXPosition,
              y: windowSize.height,
            }}
          >
            <RoomInfoComponent />
            <ChatHotBarComponent
              maxWidth={windowSize.width}
              width={safeWindowSize.width}
            />
            <ContainerComponent position={{ x: safeWindowSize.width }}>
              <SelectionPreviewComponent />
            </ContainerComponent>
          </ContainerComponent>
        </ContainerComponent>
      ) : null,
    [room],
  );
};
