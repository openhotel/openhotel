import {
  container,
  ContainerComponent,
  Cursor,
  DisplayObjectEvent,
  EventMode,
} from "@tu/tulip";
import { System } from "system";
import { SystemEvent } from "shared/enums";
import {
  boxIconComponent,
  cardIconComponent,
  catalogIconComponent,
  consoleIconComponent,
  navigatorIconComponent,
  clubIconComponent,
} from "shared/components";

type Props = {};

export const hotBarItemsComponent: ContainerComponent<Props> = (props) => {
  const $container = container(props);

  // console
  const consoleIcon = consoleIconComponent({
    eventMode: EventMode.STATIC,
    cursor: Cursor.POINTER,
  });
  // room list
  const navigatorIcon = navigatorIconComponent({
    eventMode: EventMode.STATIC,
    cursor: Cursor.POINTER,
  });
  navigatorIcon.on(DisplayObjectEvent.POINTER_TAP, () => {
    System.events.emit(SystemEvent.TOGGLE_NAVIGATOR_MODAL);
  });

  // catalog
  const catalogIcon = catalogIconComponent({
    eventMode: EventMode.STATIC,
    cursor: Cursor.POINTER,
  });

  // inventory
  const boxIcon = boxIconComponent({
    eventMode: EventMode.STATIC,
    cursor: Cursor.POINTER,
  });
  // card
  const cardIcon = cardIconComponent({
    eventMode: EventMode.STATIC,
    cursor: Cursor.POINTER,
  });
  // club
  const clubIcon = clubIconComponent({
    eventMode: EventMode.STATIC,
    cursor: Cursor.POINTER,
  });
  $container.add(
    consoleIcon,
    navigatorIcon,
    catalogIcon,
    boxIcon,
    cardIcon,
    clubIcon,
  );

  return $container.getComponent(hotBarItemsComponent);
};
