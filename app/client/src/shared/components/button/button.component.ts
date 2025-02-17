import {
  container,
  ContainerComponent,
  Cursor,
  DisplayObjectEvent,
  Event,
  EventMode,
  global,
  HorizontalAlign,
  textSprite,
} from "@tu/tulip";
import { SpriteSheetEnum } from "shared/enums";

type InputProps = {
  width: number;
  text: string;
};

type ButtonMutable = {
  setText: (text: string) => void;
  getText: () => string;
};

export type ButtonComponent = ContainerComponent<InputProps, ButtonMutable>;

export const buttonComponent: ContainerComponent<InputProps, ButtonMutable> = (
  props,
) => {
  const $container = container<InputProps, ButtonMutable>(props);

  const { text, width } = $container.getProps();

  const $button = textSprite({
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    color: 0xffffff,
    eventMode: EventMode.STATIC,
    cursor: Cursor.POINTER,
    backgroundColor: 0x222222,
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
    withContext: true,
    horizontalAlign: HorizontalAlign.CENTER,
    text,
  });
  $container.add($button);

  let removeOnKeyDown;
  $container.on(DisplayObjectEvent.ADDED, () => {
    removeOnKeyDown = global.events.on(
      Event.KEY_DOWN,
      (event: KeyboardEvent) => {
        if (!$button.isFocused()) return;
        if (event.key === "Enter")
          $button.$emit(DisplayObjectEvent.POINTER_TAP, {});
      },
    );
  });
  $container.on(DisplayObjectEvent.REMOVED, () => {
    removeOnKeyDown();
  });

  $button.on(DisplayObjectEvent.CONTEXT_ENTER, () => {
    $button.setBackgroundColor(0x666666);
  });

  $button.on(DisplayObjectEvent.CONTEXT_LEAVE, () => {
    $button.setBackgroundColor(0x222222);
  });

  return $container.getComponent(buttonComponent, {
    focus: $button.focus,
    on: $button.on,
    setText: $button.setText,
    getText: $button.getText,
  });
};
