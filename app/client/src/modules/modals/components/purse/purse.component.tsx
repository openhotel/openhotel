import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ContainerComponent,
  Cursor,
  EventMode,
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
import { MODAL_SIZE_MAP } from "shared/consts";
import { ScrollComponent, TextComponent } from "shared/components";
import { useApi, useModal } from "shared/hooks";
import { Economy, Transaction } from "shared/types";
import { TransactionComponent } from "./components";
import { useTranslation } from "react-i18next";

const MODAL_SIZE = MODAL_SIZE_MAP[Modal.PURSE];

export const PurseComponent: React.FC = () => {
  const { t } = useTranslation();
  const { fetch } = useApi();
  const { closeModal, isModalOpen } = useModal();
  const { setDragPolygon } = useDragContainer();

  const [credits, setCredits] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const $reload = useCallback(
    () =>
      fetch("/economy").then(({ credits, transactions }: Economy) => {
        setCredits(credits);
        setTransactions(transactions);
      }),
    [fetch, setCredits, setTransactions],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isModalOpen(Modal.PURSE)) return;
      $reload();
    }, 30_000);
    $reload();

    return () => clearInterval(interval);
  }, [$reload]);

  const onCloseModal = useCallback(() => closeModal(Modal.PURSE), [closeModal]);

  useEffect(() => {
    setDragPolygon?.([0, 0, MODAL_SIZE.width, 0, MODAL_SIZE.width, 15, 0, 15]);
  }, [setDragPolygon]);

  const scrollSize = useMemo(
    () => ({
      width: MODAL_SIZE.width - 28 * 2 - 1,
      height: MODAL_SIZE.height - 23 - 50 + 1,
    }),
    [],
  );

  const renderTransactions = useMemo(
    () =>
      transactions.map((transaction, index) => (
        <TransactionComponent
          key={`transaction-${index}`}
          transaction={transaction}
          scrollSize={scrollSize}
        />
      )),
    [transactions],
  );

  return useMemo(
    () => (
      <>
        <GraphicsComponent
          type={GraphicType.CIRCLE}
          radius={6.5}
          alpha={0}
          cursor={Cursor.POINTER}
          eventMode={EventMode.STATIC}
          position={{
            x: MODAL_SIZE.width - 35,
            y: 1.5,
          }}
          onPointerDown={onCloseModal}
          zIndex={20}
        />
        <ContainerComponent>
          <NineSliceSpriteComponent
            spriteSheet={SpriteSheetEnum.UI}
            texture="ui-purse-modal"
            leftWidth={30}
            rightWidth={33}
            topHeight={50}
            bottomHeight={21}
            height={MODAL_SIZE.height}
            width={MODAL_SIZE.width}
          />
          <TilingSpriteComponent
            texture="ui-purse-modal-bar-tile"
            spriteSheet={SpriteSheetEnum.UI}
            position={{
              x: 27,
              y: 4,
            }}
            width={MODAL_SIZE.width - 63}
          />

          <SpriteComponent
            spriteSheet={SpriteSheetEnum.UI}
            texture="ui-purse-top"
            position={{
              x: MODAL_SIZE.width / 2,
              y: 0,
            }}
            pivot={{
              x: 11,
              y: 17,
            }}
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
              text={t("economy.purse_title")}
              backgroundColor={0xb3a49a}
              color={0x6e5859}
              backgroundAlpha={1}
              padding={{
                left: 4,
                right: 3,
                bottom: 0,
                top: 2,
              }}
            />
          </FlexContainerComponent>

          <FlexContainerComponent
            justify={FLEX_JUSTIFY.CENTER}
            size={{
              width: MODAL_SIZE.width,
            }}
            position={{
              y: 28,
            }}
            gap={4}
          >
            <TextComponent text={credits.toString()} color={0x000} bold />
            <TextComponent text={t("economy.credits")} color={0x000} />
          </FlexContainerComponent>

          <ScrollComponent position={{ x: 23, y: 50 }} size={scrollSize}>
            <FlexContainerComponent direction="y" gap={3}>
              {renderTransactions}
            </FlexContainerComponent>
          </ScrollComponent>
        </ContainerComponent>
      </>
    ),
    [credits, onCloseModal, scrollSize, renderTransactions],
  );
};
