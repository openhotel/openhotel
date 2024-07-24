import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
  Event as KeyEvent,
  global,
  HorizontalAlign,
} from "@tulib/tulip";
import { System } from "system";
import { Event } from "shared/enums";
import { inputComponent } from "../../shared/components";

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

  const $input = await inputComponent({
    placeholder: "Click here or press 'c' to write a message",
    horizontalAlign: HorizontalAlign.LEFT,
    width: 200,
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
        const message = $input.getValue().trim();
        if (message.length) {
          System.proxy.emit(Event.MESSAGE, {
            message,
          });

          $input.clear();
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
