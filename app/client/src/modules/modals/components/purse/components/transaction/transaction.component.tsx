import React, { useMemo } from "react";
import dayjs from "dayjs";
import {
  ContainerComponent,
  FLEX_ALIGN,
  FLEX_JUSTIFY,
  FlexContainerComponent,
  NineSliceSpriteComponent,
} from "@openhotel/pixi-components";
import { SpriteSheetEnum } from "shared/enums";
import { TextComponent } from "shared/components";
import { Size2d, Transaction } from "shared/types";

type Props = {
  transaction: Transaction;
  scrollSize: Size2d;
};

export const TransactionComponent: React.FC<Props> = ({
  transaction,
  scrollSize,
}) => {
  const width = useMemo(() => scrollSize.width - 3, [scrollSize]);

  return useMemo(
    () => (
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
          justify={FLEX_JUSTIFY.SPACE_BETWEEN}
          align={FLEX_ALIGN.CENTER}
          position={{ x: 4 }}
          size={{ width: width - 8, height: 12 }}
          gap={4}
          zIndex={10}
        >
          <TextComponent
            text={dayjs(transaction.timestamp).format("DD/MM/YY")}
            color={0x000}
          />
          <TextComponent
            text={
              transaction.description.length > 33
                ? `${transaction.description.slice(0, 33)}...`
                : transaction.description
            }
            color={0x000}
          />
          <TextComponent
            text={transaction.amount.toString()}
            color={transaction.amount >= 0 ? 0x87c053 : 0xb73d22}
          />
        </FlexContainerComponent>
      </ContainerComponent>
    ),
    [width, transaction],
  );
};
