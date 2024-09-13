import {
  container,
  ContainerComponent,
  Cursor,
  DisplayObjectEvent,
  EventMode,
  HorizontalAlign,
  inputTextSprite,
  InputTextSpriteMutable,
  VerticalAlign,
} from "@tu/tulip";
import { SpriteSheetEnum } from "shared/enums";
import { Size2d } from "shared/types";

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
  setValue: (text: string) => void;
  clear: () => void;
  focus: () => void;
  setSize: (size: Size2d) => void;
  on: <Data>(event: DisplayObjectEvent, callback: (data: Data) => void) => void;
  getInputComponent: () => InputTextSpriteMutable;
};

export const inputComponent: ContainerComponent<InputProps, InputMutable> = ({
  onTextChange,
  ...props
}) => {
  const $container = container<InputProps, InputMutable>(props);

  const backgroundPadding = {
    top: 4,
    right: 8,
    bottom: 3,
    left: 8,
  };

  const {
    placeholder,
    horizontalAlign,
    maxLength,
    width,
    password,
    defaultValue,
  } = $container.getProps();

  const $input = inputTextSprite({
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
    backgroundPadding,
    placeholder,
    horizontalAlign,
    maxLength,
    passwordChar: password ? "$" : null,
    selectionColor: 0xdddddd,
    selectionVisible: false,

    defaultValue,
    verticalAlign: VerticalAlign.BOTTOM,
    onTextChange,
    withMask: true,
    accentYCorrection: -2,
  });

  $container.add($input);

  return $container.getComponent(inputComponent, {
    getValue: $input.getText,
    setValue: $input.setText,
    clear: () => $input.clear(),
    focus: $input.focus,
    setSize: (size: Size2d) => {
      $input.setSize({
        width: size.width - backgroundPadding.left - backgroundPadding.right,
        height: size.height - backgroundPadding.top - backgroundPadding.bottom,
      });
    },
    on: $input.on,
    getBounds: () => {
      const bounds = $input.getBounds();

      return {
        width: bounds.width - backgroundPadding.left - backgroundPadding.right,
        height:
          bounds.height - backgroundPadding.top - backgroundPadding.bottom,
      };
    },
  });
};
