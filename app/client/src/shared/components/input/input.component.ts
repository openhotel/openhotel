import {
  container,
  ContainerComponent,
  Cursor,
  DisplayObjectEvent,
  EventMode,
  HorizontalAlign,
  inputTextSprite,
} from "@tulib/tulip";
import { SpriteSheetEnum } from "shared/enums";

type InputProps = {
  placeholder: string;
  horizontalAlign: HorizontalAlign;
  maxLength: number;
  width: number;
  password?: boolean;
};

type InputMutable = {
  getValue: () => string;
};

export const inputComponent: ContainerComponent<
  InputProps,
  InputMutable
> = async (props) => {
  const $container = await container<InputProps, InputMutable>(props);

  const { placeholder, horizontalAlign, maxLength, width, password } =
    $container.getProps();

  const $input = await inputTextSprite({
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    color: 0x000000,
    eventMode: EventMode.STATIC,
    cursor: Cursor.TEXT,
    editable: true,
    withContext: true,
    backgroundColor: 0xffffff,
    backgroundAlpha: 1,
    size: {
      width,
      height: 7,
    },
    backgroundPadding: {
      top: 4,
      right: 8,
      bottom: 3,
      left: 8,
    },
    placeholder,
    horizontalAlign,
    maxLength,
    passwordChar: password ? "$" : null,
    selectionColor: 0xdddddd,
  });
  $input.on(DisplayObjectEvent.POINTER_TAP, () => {
    $input.focus();
  });
  $container.add($input);

  return $container.getComponent(inputComponent, {
    getValue: $input.getText,
  });
};
