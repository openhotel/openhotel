import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
  EventMode,
  global,
} from "@tu/tulip";
import { Event } from "shared/enums";
import { System } from "system";
import { messageComponent } from "./message.component";
import { RoomMutable } from "../room";
import { HumanMutable } from "modules/human";
import { CHAT_BUBBLE_MESSAGE_INTERVAL, TILE_SIZE } from "shared/consts";

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
    position: {
      x: room.getPosition().x,
      y: 0,
    },
  });

  let messages = [];
  let jumpHeight = 0;
  const jumpInterval = CHAT_BUBBLE_MESSAGE_INTERVAL;
  let timeElapsed = 0;

  const removeOnMessage = System.proxy.on<any>(
    Event.MESSAGE,
    ({ userId, message: text, color }) => {
      const human = room
        .getHumanList()
        .find((human) => human.getUser().id === userId);
      const position = human.getPosition();

      const message = messageComponent({
        username: human.getUser().username,
        color,
        message: text,
      });
      $container.add(message);

      const messageBounds = message.getBounds();
      jumpHeight = messageBounds.height + 1;

      let targetY = Math.round(position.y / jumpHeight) * jumpHeight;

      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        const { y: lastMessageY } = lastMessage.getPosition();
        targetY = Math.max(targetY, lastMessageY);
      }
      moveMessages();

      let targetX = position.x - messageBounds.width / 2 + TILE_SIZE.width / 2;

      const containerGlobalPosition = $container.getGlobalPosition();

      const globalMessageXPosition = containerGlobalPosition.x + targetX;

      const overflowRightX =
        global.getApplication().window.getBounds().width -
        (globalMessageXPosition + messageBounds.width);

      if (0 > overflowRightX) targetX += overflowRightX;
      if (0 > globalMessageXPosition) targetX -= globalMessageXPosition;

      message.setPosition({
        x: targetX,
        y: targetY,
      });
      messages.push(message);
    },
  );

  $container.on(DisplayObjectEvent.REMOVED, () => {
    removeOnMessage();
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

  return $container.getComponent(bubbleChatComponent);
};
