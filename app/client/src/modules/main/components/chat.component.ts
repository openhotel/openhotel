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
import { System } from "../../../system";
import { Event } from "shared/enums";

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
    spriteSheet: "default-font.json",
    eventMode: EventMode.NONE,
    withContext: true,
  });

  await $input.setPosition({ x: 5, y: 3 });

  $container.add($background, $input);

  global.events.on(
    KeyEvent.KEY_UP,
    ({ key }) => {
      if (key === "Enter") {
        const text = $input.getText();
        if (text.length) {
          System.proxy.emit(Event.MESSAGE, {
            message: $input.getText(),
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
