import { container, Cursor, EventMode } from "@tu/tulip";
import { tabsComponent } from "./tabs.component";

export const privateRoomsComponent = () => {
  const $container = container({
    position: {
      y: 21,
      x: 0,
    },
    cursor: Cursor.DEFAULT,
    eventMode: EventMode.STATIC,
  });

  const $privateRoomsTabs = tabsComponent();
  $container.add($privateRoomsTabs);
  return $container.getComponent(privateRoomsComponent);
};
