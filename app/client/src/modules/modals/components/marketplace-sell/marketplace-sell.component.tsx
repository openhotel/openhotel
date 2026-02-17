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
import { MarketplacePriceLimits } from "shared/types";

const MODAL_SIZE = MODAL_SIZE_MAP[Modal.MARKETPLACE_SELL];
const METADATA_WIDTH = MODAL_SIZE.width - 24 - (MODAL_SIZE.width - 24) / 3 - 8;

type MarketplaceSellData = {
  furnitureId: string;
  instanceId: string;
  onSuccess?: () => void;
};

export const MarketplaceSellComponent: React.FC = () => {
  const { t } = useTranslation();
  const { setDragPolygon } = useDragContainer();
  const { closeModal, getModalData } = useModal();
  const { fetch } = useApi();
  const { get } = useFurniture();

  const modalData = getModalData<MarketplaceSellData>(Modal.MARKETPLACE_SELL);

  const [sellPrice, setSellPrice] = useState<number>(0);
  const [priceLimits, setPriceLimits] = useState<MarketplacePriceLimits | null>(
    null,
  );
  const [isListing, setIsListing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const furnitureData = useMemo(() => {
    if (!modalData?.furnitureId) return null;
    return get(modalData.furnitureId);
  }, [modalData?.furnitureId, get]);

  useEffect(() => {
    if (!modalData?.furnitureId) return;

    fetch(
      `/marketplace/price-limits?furnitureId=${modalData.furnitureId}`,
    ).then((data: MarketplacePriceLimits) => {
      setPriceLimits(data);
      setSellPrice(data.max);
    });
  }, [modalData?.furnitureId, fetch]);

  useEffect(() => {
    setDragPolygon?.([0, 5, MODAL_SIZE.width, 5, MODAL_SIZE.width, 15, 0, 15]);
  }, [setDragPolygon]);

  const onCloseModal = useCallback(() => {
    closeModal(Modal.MARKETPLACE_SELL);
  }, [closeModal]);

  const estimatedProfit = useMemo(() => {
    if (!priceLimits) return 0;
    const commission = Math.floor(sellPrice * priceLimits.commissionRate);
    return sellPrice - commission;
  }, [sellPrice, priceLimits]);

  const isPriceValid = useMemo(() => {
    if (!priceLimits) return false;
    return sellPrice >= priceLimits.min && sellPrice <= priceLimits.max;
  }, [sellPrice, priceLimits]);

  const onConfirmSell = useCallback(() => {
    if (!priceLimits || isListing || !modalData?.instanceId) return;

    setIsListing(true);
    setError(null);

    fetch(
      "/marketplace/list",
      { instanceId: modalData.instanceId, listPrice: sellPrice },
      false,
      "POST",
    )
      .then((result) => {
        if (result.listing) {
          modalData.onSuccess?.();
          closeModal(Modal.MARKETPLACE_SELL);
        } else if (result.error) {
          setError(result.error);
        }
      })
      .catch(() => {
        setError(t("marketplace.error_selling"));
      })
      .finally(() => {
        setIsListing(false);
      });
  }, [priceLimits, sellPrice, modalData, fetch, closeModal, isListing, t]);

  const onDecreasePrice = useCallback(() => {
    if (!priceLimits) return;
    setSellPrice((p) => Math.max(priceLimits.min, p - 1));
  }, [priceLimits]);

  const onIncreasePrice = useCallback(() => {
    if (!priceLimits) return;
    setSellPrice((p) => Math.min(priceLimits.max, p + 1));
  }, [priceLimits]);

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
            text={t("marketplace.title")}
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
              gap={10}
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
                maxWidth={METADATA_WIDTH - 10}
                text={
                  furnitureData.description ??
                  "This is a test for a description"
                }
                color={0x666666}
              />

              {priceLimits ? (
                <FlexContainerComponent
                  align={FLEX_ALIGN.CENTER}
                  gap={4}
                  size={{
                    width: 20,
                    height: 14,
                  }}
                >
                  <TextComponent
                    text={t("marketplace.price_limits", {
                      min: priceLimits.min,
                      max: priceLimits.max,
                    })}
                    color={0x666666}
                  />
                  <SpriteComponent
                    texture={"coin"}
                    spriteSheet={SpriteSheetEnum.UI}
                  />
                </FlexContainerComponent>
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
                  text="-"
                  autoWidth
                  onPointerUp={onDecreasePrice}
                />
                <FlexContainerComponent
                  align={FLEX_ALIGN.CENTER}
                  gap={2}
                  size={{
                    width: 20,
                    height: 20 / 2,
                  }}
                >
                  <TextComponent
                    text={sellPrice.toString()}
                    color={isPriceValid ? 0x000000 : 0xcc0000}
                  />
                  <SpriteComponent
                    texture={"coin"}
                    spriteSheet={SpriteSheetEnum.UI}
                  />
                </FlexContainerComponent>
                <ButtonComponent
                  text="+"
                  autoWidth
                  onPointerUp={onIncreasePrice}
                />
              </FlexContainerComponent>

              <FlexContainerComponent
                align={FLEX_ALIGN.CENTER}
                gap={2}
                size={{
                  width: METADATA_WIDTH,
                  height: 10,
                }}
              >
                <TextComponent
                  text={t("marketplace.estimated_profit", {
                    profit: estimatedProfit,
                  })}
                  color={isPriceValid ? 0x000000 : 0xcc0000}
                />
                <SpriteComponent
                  texture={"coin"}
                  spriteSheet={SpriteSheetEnum.UI}
                />
              </FlexContainerComponent>

              {priceLimits ? (
                <FlexContainerComponent
                  align={FLEX_ALIGN.CENTER}
                  gap={4}
                  size={{
                    width: METADATA_WIDTH,
                    height: 10,
                  }}
                >
                  <TextComponent
                    text={t("marketplace.commission", {
                      rate: Math.round(priceLimits.commissionRate * 100),
                    })}
                    color={0x666666}
                  />
                  <SpriteComponent
                    texture={"coin"}
                    spriteSheet={SpriteSheetEnum.UI}
                  />
                </FlexContainerComponent>
              ) : null}

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
                  text={t("marketplace.confirm_sell")}
                  autoWidth
                  onPointerUp={onConfirmSell}
                />
              </FlexContainerComponent>
            </FlexContainerComponent>
          </ContainerComponent>
        </ContainerComponent>
      </ContainerComponent>
    </>
  );
};
