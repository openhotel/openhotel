import {
  container,
  ContainerComponent,
  Cursor,
  DisplayObjectEvent,
  Event as KeyEvent,
  EventMode,
  global,
  graphics,
  GraphicType,
  inputTextSprite,
} from "@tulib/tulip";
import { System } from "../../system";
import { Event, SpriteSheetEnum } from "shared/enums";

type Mutable = {};

export const chatComponent: ContainerComponent<{}, Mutable> = async () => {
  const $container = await container<{}, Mutable>({});

  const $background = await graphics({
    type: GraphicType.RECTANGLE,
    width: 200,
    height: 12,
    color: 0xeeeeff,
    eventMode: EventMode.STATIC,
    cursor: Cursor.TEXT,
  });

  const $input = await inputTextSprite({
    color: 0,
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    eventMode: EventMode.NONE,
    withContext: true,
  });

  await $input.setPosition({ x: 5, y: 3 });

  $container.add($background, $input);

  global.events.on(
    KeyEvent.KEY_UP,
    ({ key }) => {
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

  $background.on(DisplayObjectEvent.POINTER_DOWN, () => {
    $input.focus();
  });

  return $container.getComponent(chatComponent);
};
