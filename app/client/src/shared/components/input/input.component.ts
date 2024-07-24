import {
  container,
  ContainerComponent,
  Cursor,
  EventMode,
  HorizontalAlign,
  inputTextSprite,
  VerticalAlign,
} from "@tulib/tulip";
import { SpriteSheetEnum } from "shared/enums";

type InputProps = {
  placeholder: string;
  horizontalAlign: HorizontalAlign;
  maxLength: number;
  width: number;
  password?: boolean;
  defaultValue?: string;
  onTextChange?: (preText: string, postText: string) => boolean;
};

type InputMutable = {
  getValue: () => string;
  clear: () => void;
  focus: () => void;
};

export const inputComponent: ContainerComponent<
  InputProps,
  InputMutable
> = async ({ onTextChange, ...props }) => {
  const $container = await container<InputProps, InputMutable>(props);

  const {
    placeholder,
    horizontalAlign,
    maxLength,
    width,
    password,
    defaultValue,
  } = $container.getProps();

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
    defaultValue,
    verticalAlign: VerticalAlign.BOTTOM,
    onTextChange,
    withMask: true,
  });

  $container.add($input);

  return $container.getComponent(inputComponent, {
    getValue: $input.getText,
    clear: () => $input.reset(),
    focus: $input.focus,
  });
};
