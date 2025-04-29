import React, { useMemo } from "react";
import { TextComponent } from "shared/components";
import { Transaction } from "shared/types";
import {
  ContainerComponent,
  FLEX_ALIGN,
  FLEX_JUSTIFY,
  FlexContainerComponent,
  NineSliceSpriteComponent,
} from "@openhotel/pixi-components";
import {
  Modal,
  SpriteSheetEnum,
  TransactionType,
} from "../../../../../../shared/enums";
import { MODAL_SIZE_MAP } from "../../../../../../shared/consts";

type Props = {
  transaction: Transaction;
};

export const TransactionComponent: React.FC<Props> = ({ transaction }) => {
  const { width: $width } = MODAL_SIZE_MAP[Modal.PURSE];

  const width = $width - 22 * 2;

  const isIncome = useMemo(() => {
    return [
      TransactionType.REWARD,
      TransactionType.REFUND,
      TransactionType.DEPOSIT,
    ].includes(transaction.type);
  }, [transaction.type]);

  return (
    <ContainerComponent>
      <NineSliceSpriteComponent
        spriteSheet={SpriteSheetEnum.UI}
        texture="background-circle-x6"
        leftWidth={2}
        rightWidth={2}
        topHeight={1}
        bottomHeight={1}
        height={12}
        width={width}
      />
      <FlexContainerComponent
        justify={FLEX_JUSTIFY.SPACE_EVENLY}
        align={FLEX_ALIGN.CENTER}
        size={{ width, height: 12 }}
        gap={10}
        zIndex={10}
      >
        <TextComponent
          text={new Date(transaction.timestamp).toLocaleDateString()}
          color={0x000}
        />
        <TextComponent text={transaction.description} color={0x000} />
        <TextComponent
          text={`${isIncome ? "+" : "-"}${transaction.amount}`}
          color={isIncome ? 0x87c053 : 0xb73d22}
        />
      </FlexContainerComponent>
    </ContainerComponent>
  );
};
