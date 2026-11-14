import React, { useCallback, useMemo } from "react";
import { ButtonComponent, NoteComponent } from "shared/components";
import {
  ContainerComponent,
  GraphicsComponent,
  GraphicType,
  Size,
} from "@openhotel/pixi-components";
import { Event } from "../../../../../../shared/enums";
import { useProxy } from "../../../../../../shared/hooks";

type Props = {
  size: Size;
};

export const CategoryHotelComponent: React.FC<Props> = ({ size }) => {
  const { emit } = useProxy();

  const previewSize = useMemo(
    () => ({
      width: 130,
      height: size.height,
    }),
    [size],
  );

  const onJoinRoom = useCallback(() => {
    emit(Event.PRE_JOIN_ROOM, {
      roomId: "test",
    });
  }, []);

  return (
    <NoteComponent
      type="TODO"
      issue={1124}
      title="Public rooms"
      description="Create core arch to allow public rooms!"
    >
      <>
        <ContainerComponent
          position={{
            y: 20,
          }}
        >
          <ButtonComponent text="join!" autoWidth onPointerDown={onJoinRoom} />
        </ContainerComponent>
        <ContainerComponent
          position={{
            x: size.width - 130,
          }}
        >
          <NoteComponent
            type="TODO"
            issue={1134}
            title="Public rooms banner preview"
            description="Needs art!"
          >
            <GraphicsComponent
              type={GraphicType.RECTANGLE}
              width={previewSize.width}
              height={previewSize.height}
              tint={0}
              alpha={0.2}
            />
          </NoteComponent>
        </ContainerComponent>
      </>
    </NoteComponent>
  );
};
