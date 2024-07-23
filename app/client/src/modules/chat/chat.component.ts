import {
  container,
  ContainerComponent,
  Cursor,
  DisplayObjectEvent,
  Event as KeyEvent,
  EventMode,
  global,
  inputTextSprite,
} from "@tulib/tulip";
import { System } from "system";
import { Event, SpriteSheetEnum } from "shared/enums";

type Mutable = {};

export const chatComponent: ContainerComponent<{}, Mutable> = async (props) => {
  const $container = await container<{}, Mutable>(props);

  let $typing = false;
  let $typingTimeout: number;

  const setTyping = () => {
    if (!$typing) {
      System.proxy.emit(Event.TYPING_START, {});
    }

    $typing = true;
    clearTimeout($typingTimeout);
    $typingTimeout = setTimeout(() => {
      $typing = false;
      System.proxy.emit(Event.TYPING_END, {});
    }, 800);
  };

  const $input = await inputTextSprite({
    color: 0,
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    eventMode: EventMode.STATIC,
    editable: true,
    withContext: true,
    cursor: Cursor.TEXT,
    backgroundPadding: { left: 7, bottom: 2, right: 7, top: 3 },
    size: { width: 200, height: 7 },
    backgroundAlpha: 1,
    backgroundColor: 0xffffff,
    position: { x: 5, y: 3 },
    selectionColor: 0xdddddd,
    maxLength: 64,
    onTextChange: () => {
      setTyping();
      return true;
    },
  });

  $input.focus();

  $container.add($input);

  const removeOnKeyUp = global.events.on(
    KeyEvent.KEY_UP,
    ({ key }: KeyboardEvent) => {
      if (key.toLowerCase() === "c") $input.focus();
      if (key === "Enter") {
        const message = $input.getText().trim();
        if (message.length) {
          System.proxy.emit(Event.MESSAGE, {
            message,
          });

          $input.reset();
        }
      }
    },
    $container,
  );

  $container.on(DisplayObjectEvent.DESTROYED, () => {
    removeOnKeyUp();
  });

  return $container.getComponent(chatComponent);
};
