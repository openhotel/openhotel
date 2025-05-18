import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  ContainerComponent,
  Cursor,
  EventMode,
  FLEX_JUSTIFY,
  FlexContainerComponent,
  GraphicsComponent,
  GraphicType,
  KeyboardEventExtended,
  NineSliceSpriteComponent,
  TilingSpriteComponent,
  useDragContainer,
} from "@openhotel/pixi-components";
import { Event, Modal, SpriteSheetEnum } from "shared/enums";
import {
  ButtonComponent,
  InputComponent,
  ScrollComponent,
  SoftBadgeComponent,
  TextComponent,
  TitleComponent,
} from "shared/components";
import { MODAL_SIZE_MAP } from "shared/consts";
import { useTranslation } from "react-i18next";
import { useApi, useModal, useProxy } from "shared/hooks";
import { LayoutsComponent } from "./components";

const MODAL_SIZE = MODAL_SIZE_MAP[Modal.ROOM_CREATOR];

export const RoomCreatorComponent: React.FC = () => {
  const { t } = useTranslation();
  const { setDragPolygon } = useDragContainer();
  const { closeModal } = useModal();
  const { fetch } = useApi();
  const { emit } = useProxy();

  const formRef = useRef<{
    id: number;
    title: string;
    description: string;
  }>({
    id: null,
    title: null,
    description: null,
  });

  useEffect(() => {
    setDragPolygon?.([
      0,
      5,
      //
      MODAL_SIZE.width,
      5,
      //
      MODAL_SIZE.width,
      20,
      //
      0,
      20,
    ]);
  }, [setDragPolygon]);

  const onCloseModal = useCallback(() => {
    closeModal(Modal.ROOM_CREATOR);
  }, [closeModal]);

  const contentHeight = useMemo(() => MODAL_SIZE.height - 34, []);
  const formWidth = useMemo(() => MODAL_SIZE.width - (99 + 11 + 3 + 24), []);

  const onCreateRoom = useCallback(() => {
    if (isNaN(formRef.current.id) || !formRef.current.title?.length) return;

    fetch(
      "/room",
      {
        layoutId: formRef.current.id,
        title: formRef.current.title,
        description: formRef.current.description,
      },
      false,
      "PUT",
    ).then(({ room }) => {
      emit(Event.PRE_JOIN_ROOM, {
        roomId: room.id,
      });
    });
  }, [fetch, emit]);

  const onChangeLayout = useCallback((layoutId: number) => {
    formRef.current.id = layoutId;
  }, []);

  const onChangeTitle = useCallback((value: KeyboardEventExtended) => {
    formRef.current.title = value.target.value;
  }, []);
  const onChangeDescription = useCallback((value: KeyboardEventExtended) => {
    formRef.current.description = value.target.value;
  }, []);

  return (
    <>
      <GraphicsComponent
        type={GraphicType.CIRCLE}
        radius={6.5}
        alpha={0}
        cursor={Cursor.POINTER}
        eventMode={EventMode.STATIC}
        position={{
          x: MODAL_SIZE.width - 23,
          y: 1.5,
        }}
        onPointerDown={onCloseModal}
        zIndex={20}
        pivot={{ x: 0, y: -5 }}
      />
      <ContainerComponent>
        <NineSliceSpriteComponent
          spriteSheet={SpriteSheetEnum.UI}
          texture="ui-base-modal"
          leftWidth={14}
          rightWidth={21}
          topHeight={22}
          bottomHeight={11}
          height={MODAL_SIZE.height}
          width={MODAL_SIZE.width}
        />
        <TilingSpriteComponent
          texture="ui-base-modal-bar-tile"
          spriteSheet={SpriteSheetEnum.UI}
          position={{
            x: 11,
            y: 4,
          }}
          width={MODAL_SIZE.width - 35}
        />
        <FlexContainerComponent
          justify={FLEX_JUSTIFY.CENTER}
          size={{
            width: MODAL_SIZE.width,
          }}
          position={{
            y: 4,
          }}
        >
          <TextComponent
            text={t("room_creator.title")}
            backgroundColor={0xacc1ed}
            backgroundAlpha={1}
            padding={{
              left: 4,
              right: 3,
              bottom: 0,
              top: 2,
            }}
          />
        </FlexContainerComponent>
        <ContainerComponent
          position={{
            x: 12,
            y: 22,
          }}
        >
          <TitleComponent title={t("room_creator.form.layout")}>
            <ScrollComponent
              size={{
                width: 99,
                height: contentHeight - 8,
              }}
            >
              <LayoutsComponent onChange={onChangeLayout} />
            </ScrollComponent>
          </TitleComponent>
          <ContainerComponent
            position={{
              x: 99 + 11 + 3,
            }}
          >
            <TitleComponent title={t("room_creator.form.title")}>
              <InputComponent
                size={{
                  width: formWidth,
                }}
                placeholder={t("room_creator.form.title")}
                onChange={onChangeTitle}
                maxLength={32}
              />
            </TitleComponent>
            <TitleComponent
              title={t("room_creator.form.description")}
              position={{
                y: 14 * 2,
              }}
            >
              <InputComponent
                size={{
                  width: formWidth,
                  height: 14 * 3,
                }}
                placeholder={t("room_creator.form.description")}
                onChange={onChangeDescription}
                maxLength={64}
              />
            </TitleComponent>
            {/*<TitleComponent*/}
            {/*  title={t("room_creator.form.category")}*/}
            {/*  position={{*/}
            {/*    y: 14 * 6,*/}
            {/*  }}*/}
            {/*>*/}
            {/*  <InputComponent*/}
            {/*    size={{*/}
            {/*      width: formWidth,*/}
            {/*    }}*/}
            {/*    placeholder={t("room_creator.form.category")}*/}
            {/*  />*/}
            {/*</TitleComponent>*/}
            <ContainerComponent position={{ x: 0, y: contentHeight - 20 }}>
              <SoftBadgeComponent
                size={{ width: formWidth, height: 20 }}
              ></SoftBadgeComponent>
              <FlexContainerComponent
                position={{
                  x: -3,
                  y: 3,
                }}
                size={{
                  width: formWidth,
                }}
                justify={FLEX_JUSTIFY.END}
              >
                <ButtonComponent
                  text={t("room_creator.form.create_room")}
                  autoWidth
                  size={{
                    height: 14,
                  }}
                  onPointerDown={onCreateRoom}
                />
              </FlexContainerComponent>
            </ContainerComponent>
          </ContainerComponent>
        </ContainerComponent>
      </ContainerComponent>
    </>
  );
};
