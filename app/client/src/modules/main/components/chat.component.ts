import {
  container,
  ContainerComponent,
  box,
  inputTextSprite,
  global,
  Event as KeyEvent,
} from "@tulib/tulip";
import { System } from "../../../system";
import { Event } from "shared/enums";

type Mutable = {};

export const chatComponent: ContainerComponent<{}, Mutable> = async () => {
  const $container = await container<{}, Mutable>();

  const $box = await box({
    width: 200,
    height: 15,
    color: 0xeeeeff,
    mass: 0,
  });

  const $input = await inputTextSprite({
    color: 0x000000,
    spriteSheet: "default-font.json",
  });

  await $box.setPivot({ x: -100, y: 0 });
  await $input.setPivot({ x: -5, y: 3 });

  $container.add($box, $input);

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

  return $container.getComponent(chatComponent);
};
