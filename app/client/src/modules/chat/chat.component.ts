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
import { MAX_MESSAGES_HISTORY } from "../../shared/consts";

type Mutable = {
  setInputWidth: (width: number) => Promise<void>;
};

export const chatComponent: ContainerComponent<{}, Mutable> = async (props) => {
  const $container = await container<{}, Mutable>(props);

  let $typing = false;
  let $typingTimeout: number;

  let $history: string[] = [];
  let $historyIndex = -1;

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
    width: 100,
    maxLength: 64,

    onTextChange: () => {
      setTyping();
      return true;
    },
  });

  $input.focus();

  const setInputWidth = (width: number) => $input.setSize({ width, height: 7 });

  $container.add($input);

  const addMessage = (message: string) => {
    $historyIndex = -1;
    if ($history.indexOf(message) === -1) {
      $history.unshift(message);
      if ($history.length > MAX_MESSAGES_HISTORY) {
        $history.pop();
      }
    }
  };

  const removeOnKeyUp = global.events.on(
    KeyEvent.KEY_UP,
    ({ key }: KeyboardEvent) => {
      if (key.toLowerCase() === "c") $input.focus();

      if (key === "ArrowUp" && $history.length > 0) {
        $historyIndex = Math.min($history.length - 1, $historyIndex + 1);
        $input.setValue($history[$historyIndex]);
      }
      if (key === "ArrowDown" && $history.length > 0) {
        $historyIndex = Math.max(-1, $historyIndex - 1);
        if ($historyIndex >= 0) {
          $input.setValue($history[$historyIndex]);
        } else {
          $input.clear();
        }
      }

      if (key === "Enter") {
        const message = $input.getValue().trim();
        if (message.length) {
          addMessage(message);
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

  return $container.getComponent(chatComponent, {
    setInputWidth,
  });
};
