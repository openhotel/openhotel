import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
  EventMode,
} from "@tu/tulip";
import { Event } from "shared/enums";
import { System } from "system";
import { messageComponent } from "./message.component";
import { HumanMutable } from "modules/human";
import { CHAT_BUBBLE_MESSAGE_INTERVAL, TILE_SIZE } from "shared/consts";
import { PrivateRoomMutable, RoomMutable } from "modules/scenes/private-room";

type Props = {
  room: RoomMutable;
};

type Mutable = {
  getHumanList: () => HumanMutable[];
};

export const bubbleChatComponent: ContainerComponent<Props, Mutable> = ({
  room,
}) => {
  const $container = container<{}, Mutable>({
    sortableChildren: true,
    eventMode: EventMode.NONE,
  });

  let messages = [];
  let jumpHeight = 0;
  const jumpInterval = CHAT_BUBBLE_MESSAGE_INTERVAL;
  let timeElapsed = 0;

  const onMessage = ({ accountId, message: text, color, whisper }) => {
    const human = room
      .getHumanList()
      .find((human) => human.getUser().accountId === accountId);

    const message = messageComponent({
      username: human.getUser().username,
      color,
      message: text,
      ...(whisper ? { backgroundColor: 0xb2b2b2 } : {}),
    });
    const messageBounds = message.getBounds();
    const messageBoundsWidth = messageBounds.width / 2;

    const humaPosition = human.getGlobalPosition();

    message.setPivotX(messageBoundsWidth - TILE_SIZE.width / 2);
    $container.add(message);

    jumpHeight = messageBounds.height + 2;

    //TODO 70 is the height of the human from the middle tile position
    let targetY = Math.round((humaPosition.y - 70) / jumpHeight) * jumpHeight;

    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const { y: lastMessageY } = lastMessage.getPosition();
      targetY = Math.max(targetY, lastMessageY);
    }
    moveMessages();

    const $room =
      System.displayObjects.getComponent<PrivateRoomMutable>("private-room");

    const roomPosition = $room.getPosition();

    message.setPosition({
      x: humaPosition.x - roomPosition.x,
      y: targetY,
    });
    messages.push(message);
  };

  const removeOnWhisperMessage = System.proxy.on<any>(
    Event.WHISPER_MESSAGE,
    (data) => onMessage({ ...data, whisper: true }),
  );
  const removeOnMessage = System.proxy.on(Event.MESSAGE, onMessage);

  $container.on(DisplayObjectEvent.REMOVED, () => {
    removeOnMessage();
    removeOnWhisperMessage();
  });

  const moveMessages = () => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];

      const absolutePosition = message.getGlobalPosition();

      if (0 > absolutePosition.y) {
        message.$destroy();
        messages.splice(i, 1);
      } else {
        const position = message.getPosition();
        message.setPositionY(position.y - jumpHeight);
      }
    }

    timeElapsed = 0;
  };

  $container.on<{ deltaTime: number }>(
    DisplayObjectEvent.TICK,
    ({ deltaTime }) => {
      timeElapsed += deltaTime;

      if (timeElapsed >= jumpInterval) {
        moveMessages();
      }
    },
  );

  let onRemoveResize;

  $container.on(DisplayObjectEvent.UNMOUNT, () => {
    onRemoveResize?.();
  });

  return $container.getComponent(bubbleChatComponent);
};
