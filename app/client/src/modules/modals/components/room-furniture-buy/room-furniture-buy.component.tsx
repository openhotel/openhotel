import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ContainerComponent,
  Cursor,
  EventMode,
  FLEX_ALIGN,
  FLEX_JUSTIFY,
  FlexContainerComponent,
  GraphicsComponent,
  GraphicType,
  NineSliceSpriteComponent,
  SpriteComponent,
  TilingSpriteComponent,
  useDragContainer,
} from "@openhotel/pixi-components";
import { Modal, SpriteSheetEnum } from "shared/enums";
import {
  ButtonComponent,
  FurniturePreviewComponent,
  SoftBadgeComponent,
  TextComponent,
} from "shared/components";
import { MODAL_SIZE_MAP } from "shared/consts";
import { useTranslation } from "react-i18next";
import { useApi, useFurniture, useModal } from "shared/hooks";

const MODAL_SIZE = MODAL_SIZE_MAP[Modal.ROOM_FURNITURE_BUY];
const METADATA_WIDTH = MODAL_SIZE.width - 24 - (MODAL_SIZE.width - 24) / 3 - 8;

type RoomFurnitureBuyData = {
  furnitureId: string;
  instanceId: string;
  roomId: string;
  price: number;
  onSuccess?: () => void;
};

export const RoomFurnitureBuyComponent: React.FC = () => {
  const { t } = useTranslation();
  const { setDragPolygon } = useDragContainer();
  const { closeModal, getModalData } = useModal();
  const { fetch } = useApi();
  const { get } = useFurniture();

  const modalData = getModalData<RoomFurnitureBuyData>(
    Modal.ROOM_FURNITURE_BUY,
  );

  const [isBuying, setIsBuying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const furnitureData = useMemo(() => {
    if (!modalData?.furnitureId) return null;
    return get(modalData.furnitureId);
  }, [modalData?.furnitureId, get]);

  useEffect(() => {
    setDragPolygon?.([0, 5, MODAL_SIZE.width, 5, MODAL_SIZE.width, 15, 0, 15]);
  }, [setDragPolygon]);

  const onCloseModal = useCallback(() => {
    closeModal(Modal.ROOM_FURNITURE_BUY);
  }, [closeModal]);

  const onConfirmBuy = useCallback(() => {
    if (isBuying || !modalData) return;

    setIsBuying(true);
    setError(null);

    fetch(
      "/room/furniture/buy",
      {
        roomId: modalData.roomId,
        furnitureId: modalData.instanceId,
      },
      false,
      "POST",
    )
      .then(() => {
        modalData.onSuccess?.();
        closeModal(Modal.ROOM_FURNITURE_BUY);
      })
      .catch(() => {
        setError(t("furniture.buy_error"));
      })
      .finally(() => {
        setIsBuying(false);
      });
  }, [modalData, fetch, closeModal, isBuying, t]);

  if (!modalData || !furnitureData) return null;

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
            text={t("furniture.buy_title")}
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
          <FurniturePreviewComponent
            furnitureData={furnitureData}
            size={{
              width: (MODAL_SIZE.width - 24) / 3,
              height: MODAL_SIZE.height - 17 - 8 * 2,
            }}
          />

          <ContainerComponent
            position={{
              x: (MODAL_SIZE.width - 24) / 3 + 8,
              y: 0,
            }}
          >
            <SoftBadgeComponent
              size={{
                width: METADATA_WIDTH,
                height: MODAL_SIZE.height - 17 - 8 * 2,
              }}
            />
            <FlexContainerComponent
              justify={FLEX_JUSTIFY.SPACE_EVENLY}
              align={FLEX_ALIGN.CENTER}
              gap={8}
              direction="y"
              size={{
                width: METADATA_WIDTH,
                height: MODAL_SIZE.height - 17 - 8 * 2,
              }}
            >
              <TextComponent
                text={furnitureData.label || modalData.furnitureId}
                color={0x000000}
              />

              <TextComponent
                text={t("furniture.buy_confirmation")}
                color={0x000000}
                maxWidth={METADATA_WIDTH - 10}
              />

              <FlexContainerComponent
                align={FLEX_ALIGN.CENTER}
                gap={4}
                size={{
                  width: METADATA_WIDTH,
                  height: 14,
                }}
              >
                <TextComponent
                  text={t("furniture.price_label", { price: modalData.price })}
                  color={0x000000}
                />
                <SpriteComponent
                  texture={"coin"}
                  spriteSheet={SpriteSheetEnum.UI}
                />
              </FlexContainerComponent>

              {error ? (
                <TextComponent
                  maxWidth={METADATA_WIDTH}
                  text={error}
                  color={0xcc0000}
                />
              ) : null}

              <FlexContainerComponent
                align={FLEX_ALIGN.CENTER}
                gap={10}
                size={{
                  width: METADATA_WIDTH,
                  height: 14,
                }}
              >
                <ButtonComponent
                  text={t("marketplace.confirm_cancel")}
                  autoWidth
                  onPointerUp={onCloseModal}
                />
                <ButtonComponent
                  text={t("furniture.confirm_buy_button")}
                  autoWidth
                  onPointerUp={onConfirmBuy}
                />
              </FlexContainerComponent>
            </FlexContainerComponent>
          </ContainerComponent>
        </ContainerComponent>
      </ContainerComponent>
    </>
  );
};
