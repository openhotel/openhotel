import {
  ContainerMutable,
  Cursor,
  DisplayObjectEvent,
  draggableContainer,
  Event,
  global,
} from "@tu/tulip";
import { System } from "system";
import { SystemEvent } from "shared/enums";
import {
  changelogModalComponent,
  catalogModalComponent,
  navigatorModalComponent,
} from "modules/interfaces";

export const interfacesComponent: ContainerMutable<{}, any> = (props) => {
  const $container = draggableContainer({
    zIndex: 50,
    grabCursor: Cursor.GRAB,
    grabbingCursor: Cursor.GRABBING,
    size: global.window.getBounds(),
    ...props,
  });

  const $navigator = navigatorModalComponent();
  const $catalog = catalogModalComponent();
  const $changelog = changelogModalComponent();

  $container.add($navigator);
  $container.add($catalog);
  $container.add($changelog);

  let $removeOnResize;
  let $removeOnHideModals;
  $container.on(DisplayObjectEvent.MOUNT, () => {
    $removeOnResize = global.events.on(Event.RESIZE, (size) => {
      $container.setSize(size);
    });

    $removeOnHideModals = System.events.on(SystemEvent.HIDE_MODALS, () => {
      System.events.emit(SystemEvent.HIDE_NAVIGATOR_MODAL);
      System.events.emit(SystemEvent.HIDE_CATALOG_MODAL);
      System.events.emit(SystemEvent.HIDE_CHANGELOG_MODAL);
      // ...
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
    $removeOnHideModals();
  });

  return $container.getComponent(interfacesComponent);
};
