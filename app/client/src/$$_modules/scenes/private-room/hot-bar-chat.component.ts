import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
  Event,
  global,
  graphics,
  GraphicType,
} from "@tu/tulip";
import { Size2d } from "shared/types";
import { chatInputComponent } from "modules/chat";
import { hotBarItemsComponent } from "modules/interfaces";
import { HOT_BAR_HEIGHT } from "shared/consts";

type Props = {};

export const hotBarChatComponent: ContainerComponent<Props> = () => {
  const $container = container({
    zIndex: 10,
  });

  const bg = graphics({
    type: GraphicType.RECTANGLE,
    width: 20,
    height: HOT_BAR_HEIGHT,
    tint: 0x525457,
  });
  $container.add(bg);

  const chat = chatInputComponent({
    position: {
      x: 4,
      y: 8,
    },
    visible: true,
  });
  $container.add(chat);

  const itemContainer = hotBarItemsComponent({
    position: {
      x: 0,
      y: 3,
    },
  });
  $container.add(itemContainer);

  const childList = itemContainer.getChildren();
  for (let i = 0; i < childList.length; i++) childList[i].setPositionX(i * 25);

  const resize = (size: Size2d) => {
    bg.setRectangle(size.width, HOT_BAR_HEIGHT);

    $container.setPositionY(size.height - HOT_BAR_HEIGHT);

    itemContainer.setPositionX(
      size.width - itemContainer.getBounds().width - 6,
    );
    chat.setInputWidth(size.width - (itemContainer.getBounds().width + 12));
  };

  $container.on(DisplayObjectEvent.ADDED, () => {
    resize(global.getApplication().window.getBounds());
    global.events.on(Event.RESIZE, resize);
  });

  return $container.getComponent(hotBarChatComponent);
};
