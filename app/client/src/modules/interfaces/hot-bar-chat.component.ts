import {
  container,
  ContainerComponent,
  Cursor,
  DisplayObjectEvent,
  Env,
  Event,
  EventMode,
  global,
  graphics,
  GraphicType,
} from "@tu/tulip";
import { Size2d } from "shared/types";
import { chatInputComponent } from "modules/chat";
import { System } from "system";
import { SystemEvent } from "shared/enums";

type Props = {};

export const hotBarChatComponent: ContainerComponent<Props> = () => {
  const $container = container({
    zIndex: 10,
  });

  const height = 24 + global.envs.get(Env.SAFE_AREA_INSET_BOTTOM);

  const bg = graphics({
    type: GraphicType.RECTANGLE,
    width: 20,
    height: height + 2,
    tint: 0xff00ff,
  });
  $container.add(bg);

  const chat = chatInputComponent({
    position: {
      x: 4,
      y: 2 + 3,
    },
    visible: true,
  });
  $container.add(chat);

  const itemContainer = container();
  $container.add(itemContainer);

  // room list
  const icon = graphics({
    type: GraphicType.RECTANGLE,
    width: 20,
    height: 20,
    tint: 0x00ffff,
    pivot: {
      x: -2,
      y: -2,
    },
    eventMode: EventMode.STATIC,
    cursor: Cursor.POINTER,
  });
  icon.on(DisplayObjectEvent.POINTER_TAP, () => {
    System.events.emit(SystemEvent.TOGGLE_NAVIGATOR_MODAL);
  });

  // console
  const iconB = graphics({
    type: GraphicType.RECTANGLE,
    width: 20,
    height: 20,
    tint: 0xffff00,
    pivot: {
      x: -2,
      y: -2,
    },
    position: {
      x: 24,
      y: 0,
    },
    eventMode: EventMode.STATIC,
    cursor: Cursor.POINTER,
  });

  // catalog
  const iconC = graphics({
    type: GraphicType.RECTANGLE,
    width: 20,
    height: 20,
    tint: 0x00ff00,
    pivot: {
      x: -2,
      y: -2,
    },
    position: {
      x: 24 * 2,
      y: 0,
    },
    eventMode: EventMode.STATIC,
    cursor: Cursor.POINTER,
  });

  // inventory
  const iconD = graphics({
    type: GraphicType.RECTANGLE,
    width: 20,
    height: 20,
    tint: 0x0000ff,
    pivot: {
      x: -2,
      y: -2,
    },
    position: {
      x: 24 * 3,
      y: 0,
    },
    eventMode: EventMode.STATIC,
    cursor: Cursor.POINTER,
  });
  itemContainer.add(icon, iconB, iconC, iconD);

  const resize = (size: Size2d) => {
    bg.setRectangle(size.width, height + 2);

    $container.setPositionY(size.height - height - 2);

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
