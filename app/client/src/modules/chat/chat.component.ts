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
import { inputComponent } from "shared/components";
import { MAX_MESSAGES_HISTORY } from "shared/consts";

type Mutable = {
  setInputWidth: (width: number) => void;
};

export const chatComponent: ContainerComponent<{}, Mutable> = (props) => {
  const $container = container<{}, Mutable>(props);

  let $typing = false;
  let $typingTimeout: number;

  let $history: string[] = [];
  let $historyIndex = -1;

  const setTyping = (text: string) => {
    if (text.startsWith("/")) return;
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

  const MAX_LENGTH = 64;
  const $input = inputComponent({
    placeholder: "Click here or press 'c' to write a message",
    horizontalAlign: HorizontalAlign.LEFT,
    width: 100,
    maxLength: MAX_LENGTH,

    onTextChange: (_, postText) => {
      setTyping(postText);
      return true;
    },
  });
  $input.on(DisplayObjectEvent.LOADED, () => {
    $input.focus();
    $container.$emit(DisplayObjectEvent.LOADED, {});
  });

  const setInputWidth = (width: number) => $input.setSize({ width, height: 7 });

  $container.add($input);

  const $sendMessage = () => {
    const message = $input.getValue().trim();
    $input.clear();
    if (message.length) {
      $historyIndex = -1;
      if ($history.indexOf(message) === -1) {
        $history.unshift(message);
        if ($history.length > MAX_MESSAGES_HISTORY) {
          $history.pop();
        }
      }

      System.proxy.emit(Event.MESSAGE, {
        message,
      });
    }
  };

  const removeOnKeyUp = global.events.on(
    KeyEvent.KEY_UP,
    ({ key }: KeyboardEvent) => {
      if (key.toLowerCase() === "c") return $input.focus();

      if (key === "ArrowUp" && $history.length > 0) {
        $historyIndex = Math.min($history.length - 1, $historyIndex + 1);
        $input.setValue($history[$historyIndex]);
        return;
      }
      if (key === "ArrowDown" && $history.length > 0) {
        $historyIndex = Math.max(-1, $historyIndex - 1);
        if ($historyIndex >= 0) {
          $input.setValue($history[$historyIndex]);
        } else {
          $input.clear();
        }
        return;
      }

      if (key === "Enter") return $sendMessage();

      if ($input.getValue().length === MAX_LENGTH) $sendMessage();
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
