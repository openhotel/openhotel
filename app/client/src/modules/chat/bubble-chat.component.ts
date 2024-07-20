import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
  EventMode,
} from "@tulib/tulip";
import { Event } from "shared/enums";
import { System } from "system";
import { messageComponent } from "./message.component";
import { RoomMutable } from "../room";

type Props = {
  room: RoomMutable;
};

type Mutable = {
  getHumanList: () => any[];
};

export const bubbleChatComponent: ContainerComponent<Props, Mutable> = async ({
  room,
}) => {
  const $container = await container<{}, Mutable>({
    sortableChildren: true,
    eventMode: EventMode.NONE,
  });

  let messages = [];
  let jumpHeight = 10;
  const jumpInterval = 60;
  let timeElapsed = 0;

  System.proxy.on<any>(
    Event.MESSAGE,
    async ({ userId, message: text, color }) => {
      const human = room
        .getHumanList()
        .find((human) => human.getUser().id === userId);
      const { x: parentX, y: parentY } = human.getFather().getPosition();
      const { x, y } = human.getPosition();

      const message = await messageComponent({
        username: human.getUser().username,
        color,
        message: text,
      });

      let newY = parentY + y - 100;
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        const { y: lastMessageY } = lastMessage.getPosition();
        newY = Math.max(newY, lastMessageY);
      }
      moveMessages();

      await message.setPosition({
        x: parentX + x - message.getBounds().width / 3,
        y: newY,
      });

      messages.push(message);
      $container.add(message);

      jumpHeight = message.getBounds().height + 1;
    },
  );

  const moveMessages = () => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      const { y } = message.getPosition();

      if (y < 10) {
        message.$destroy();
        messages.splice(i, 1);
      } else {
        message.setPositionY(y - jumpHeight);
      }
    }

    timeElapsed = 0;
  };

  $container.on(DisplayObjectEvent.TICK, ({ deltaTime }) => {
    timeElapsed += deltaTime;

    if (timeElapsed >= jumpInterval) {
      moveMessages();
    }
  });

  return $container.getComponent(bubbleChatComponent);
};
