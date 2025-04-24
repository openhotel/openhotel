import React, { useCallback, useEffect, useState } from "react";
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
import { TextComponent } from "shared/components";
import { useApi, useModal } from "shared/hooks";
import { Transaction } from "shared/types";
import { TransactionComponent } from "./components";

export const PurseComponent: React.FC = () => {
  const { fetch } = useApi();
  const { closeModal } = useModal();
  const { setDragPolygon } = useDragContainer();

  const [credits, setCredits] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const $request = useCallback(() => {
    fetch("/economy").then(
      ({
        credits,
        transactions,
      }: {
        credits: number;
        transactions: Transaction[];
      }) => {
        setCredits(credits);
        setTransactions(transactions);
      },
    );
  }, [fetch, setCredits, setTransactions]);

  useEffect(() => {
    $request();
  }, [$request]);

  console.log({ credits, transactions });
  return (
    <PurseComponentWrapper
      credits={credits}
      transactions={transactions}
      onPointerDown={() => closeModal(Modal.PURSE)}
      setDragPolygon={setDragPolygon}
    />
  );
};

type Props = {
  credits: number;
  transactions: Transaction[];
  onPointerDown: () => void;
  setDragPolygon: (polygon: number[]) => void;
};

export const PurseComponentWrapper: React.FC<Props> = ({
  credits,
  transactions,
  onPointerDown,
  setDragPolygon,
}) => {
  const { width, height } = MODAL_SIZE_MAP[Modal.PURSE];

  useEffect(() => {
    setDragPolygon?.([0, 0, width, 0, width, 15, 0, 15]);
  }, [setDragPolygon]);

  return (
    <>
      <GraphicsComponent
        type={GraphicType.CIRCLE}
        radius={6.5}
        alpha={0}
        cursor={Cursor.POINTER}
        eventMode={EventMode.STATIC}
        position={{
          x: width - 35,
          y: 1.5,
        }}
        onPointerDown={onPointerDown}
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
          height={height}
          width={width}
        />
        <TilingSpriteComponent
          texture="ui-purse-modal-bar-tile"
          spriteSheet={SpriteSheetEnum.UI}
          position={{
            x: 27,
            y: 4,
          }}
          width={width - 63}
        />

        <SpriteComponent
          spriteSheet={SpriteSheetEnum.UI}
          texture="ui-purse-top"
          position={{
            x: width / 2,
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
            width,
          }}
          position={{
            y: 28,
          }}
          gap={4}
        >
          <TextComponent text={credits.toString()} color={0x000} bold />
          <TextComponent text="credits" color={0x000} />
        </FlexContainerComponent>

        <FlexContainerComponent
          direction="y"
          gap={3}
          position={{ x: 22, y: 50 }}
        >
          {transactions.map((transaction, index) => (
            <TransactionComponent
              key={`transaction-${index}`}
              transaction={transaction}
            />
          ))}
        </FlexContainerComponent>
      </ContainerComponent>
    </>
  );
};
