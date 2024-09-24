import {
  Cursor,
  DisplayObjectEvent,
  draggableContainer,
  Event,
  global,
} from "@tu/tulip";
import { navigatorModalComponent } from "modules/interfaces";

export const interfacesComponent = () => {
  const $container = draggableContainer({
    zIndex: 100,
    grabCursor: Cursor.GRAB,
    grabbingCursor: Cursor.GRABBING,
    size: global.window.getBounds(),
  });

  const $navigator = navigatorModalComponent();
  $container.add($navigator);

  let $removeOnResize;
  $container.on(DisplayObjectEvent.MOUNT, () => {
    $removeOnResize = global.events.on(Event.RESIZE, (size) => {
      $container.setSize(size);
    });

    const destroyNavigatorVisibility = $navigator.on(
      DisplayObjectEvent.VISIBILITY_CHANGE,
      ({ visible }) => {
        if (!visible) return;

        const navigatorBounds = $navigator.getBounds();
        const windowBounds = global.window.getBounds();
        $navigator.setPosition({
          x: windowBounds.width - navigatorBounds.width - 20,
          y: windowBounds.height / 2 - navigatorBounds.height / 2,
        });
        destroyNavigatorVisibility();
      },
    );
  });
  $container.on(DisplayObjectEvent.UNMOUNT, () => {
    $removeOnResize();
  });

  return $container.getComponent(interfacesComponent);
};
