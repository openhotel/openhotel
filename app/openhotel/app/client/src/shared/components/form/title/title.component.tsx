import React from "react";
import {
  ContainerComponent,
  ContainerProps,
  TextProps,
} from "@openhotel/pixi-components";
import { TextComponent } from "shared/components/text";

type Props = {
  title: string;
  titleProps?: TextProps;
  children: React.ReactNode;
} & ContainerProps;

const HEIGHT = 8;

export const TitleComponent: React.FC<Props> = ({
  title,
  titleProps,
  children,
  ...containerProps
}) => {
  return (
    <ContainerComponent {...containerProps}>
      <TextComponent
        text={title}
        color={titleProps?.color ?? 0}
        {...titleProps}
      />
      <ContainerComponent
        position={{
          y: HEIGHT,
        }}
      >
        {children}
      </ContainerComponent>
    </ContainerComponent>
  );
};
