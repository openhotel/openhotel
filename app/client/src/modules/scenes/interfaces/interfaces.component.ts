import {
  Cursor,
  DisplayObjectEvent,
  draggableContainer,
  global,
  Event,
} from "@tu/tulip";
import { navigatorModalComponent } from "modules/interfaces";

export const interfacesComponent = () => {
  const $container = draggableContainer({
    zIndex: 100,
    grabCursor: Cursor.GRAB,
    grabbingCursor: Cursor.GRABBING,
    size: global.window.getBounds(),
  });

  $container.add(navigatorModalComponent());

  let $removeOnResize;
  $container.on(DisplayObjectEvent.MOUNT, () => {
    $removeOnResize = global.events.on(Event.RESIZE, (size) => {
      $container.setSize(size);
    });
  });
  $container.on(DisplayObjectEvent.UNMOUNT, () => {
    $removeOnResize();
  });

  return $container.getComponent(interfacesComponent);
};
