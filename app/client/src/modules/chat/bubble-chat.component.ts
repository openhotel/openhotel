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
import { HumanMutable } from "modules/human";
import { CHAT_BUBBLE_MESSAGE_INTERVAL, TILE_SIZE } from "shared/consts";
import { RoomMutable } from "modules/scenes/private-room";

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

  const removeOnMessage = System.proxy.on<any>(
    Event.MESSAGE,
    ({ accountId, message: text, color }) => {
      const human = room
        .getHumanList()
        .find((human) => human.getUser().accountId === accountId);
      const position = human.getPosition();

      const message = messageComponent({
        username: human.getUser().username,
        color,
        message: text,
      });
      const messageBounds = message.getBounds();
      const messageBoundsWidth = messageBounds.width / 2;

      message.setPivotX(messageBoundsWidth - TILE_SIZE.width / 2);
      $container.add(message);

      jumpHeight = messageBounds.height + 2;

      let targetY = Math.round(position.y / jumpHeight) * jumpHeight;

      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        const { y: lastMessageY } = lastMessage.getPosition();
        targetY = Math.max(targetY, lastMessageY);
      }
      moveMessages();
      //
      let targetX = human.getGlobalPosition().x;

      const leftBound = $container.getPosition().x;
      // Better to use the size of the parent Container
      // -1 is a magic number that prevents overflowing
      const rightBound = global.getApplication().window.getBounds().width - 1;

      const isOverflowingLeft =
        Math.round(targetX - messageBoundsWidth + TILE_SIZE.width / 2) <
        leftBound;
      const isOverflowingRight =
        Math.round(targetX + messageBoundsWidth + TILE_SIZE.width / 2) >
        rightBound;

      if (isOverflowingLeft) {
        const overflow = Math.round(
          leftBound - (targetX - messageBoundsWidth) - TILE_SIZE.width / 2,
        );
        targetX += overflow;
      }

      if (isOverflowingRight) {
        const overflow = Math.round(
          targetX + messageBoundsWidth - rightBound + TILE_SIZE.width / 2,
        );
        targetX -= overflow;
      }

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
