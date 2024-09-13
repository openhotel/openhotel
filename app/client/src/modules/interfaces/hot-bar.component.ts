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
import { System } from "system";
import { SystemEvent } from "shared/enums";

type Props = {};

export const hotBarComponent: ContainerComponent<Props> = () => {
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

  global.events.on(
    Event.SAFE_AREA_INSET_BOTTOM,
    ({ vale: safeAreaInsetBottom }) => {},
  );

  const itemContainer = container();
  $container.add(itemContainer);

  // room list
  const icon = graphics({
    type: GraphicType.RECTANGLE,
    width: 20,
    height: 20,
    tint: 0x00ffff,
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
    eventMode: EventMode.STATIC,
    cursor: Cursor.POINTER,
  });

  // catalog
  const iconC = graphics({
    type: GraphicType.RECTANGLE,
    width: 20,
    height: 20,
    tint: 0x00ff00,
    eventMode: EventMode.STATIC,
    cursor: Cursor.POINTER,
  });

  // inventory
  const iconD = graphics({
    type: GraphicType.RECTANGLE,
    width: 20,
    height: 20,
    tint: 0x0000ff,
    eventMode: EventMode.STATIC,
    cursor: Cursor.POINTER,
  });
  itemContainer.add(icon, iconB, iconC, iconD);

  const resize = (size: Size2d) => {
    bg.setRectangle(size.width, height + 2);

    $container.setPositionY(size.height - height - 2);

    const items = itemContainer.getChildren();
    const posX = size.width / items.length;

    const itemWidth = items[0].getBounds().width;

    for (let i = 0; i < items.length; i++)
      items[i].setPosition({
        x: posX / 2 + posX * i - itemWidth / 2,
        y: 2,
      });
  };

  $container.on(DisplayObjectEvent.ADDED, () => {
    resize(global.getApplication().window.getBounds());
    global.events.on(Event.RESIZE, resize);
  });

  return $container.getComponent(hotBarComponent);
};
