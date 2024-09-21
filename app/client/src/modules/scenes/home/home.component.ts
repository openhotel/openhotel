import { container, ContainerComponent, DisplayObjectEvent } from "@tu/tulip";
import { logoComponent } from "modules/main";
import { hotBarComponent } from "modules/interfaces";
import { System } from "system";
import { SystemEvent } from "shared/enums";

type Props = {};

export const homeComponent: ContainerComponent<Props> = () => {
  const $container = container();

  const $logo = logoComponent();
  $logo.setPosition({ x: 10, y: 40 });
  const $hotBar = hotBarComponent();
  $container.add($logo, $hotBar);

  $container.on(DisplayObjectEvent.MOUNT, (e) => {
    System.events.emit(SystemEvent.SHOW_NAVIGATOR_MODAL);

    // if (isDevelopment()) {
    //   System.proxy.emit(Event.JOIN_ROOM, {
    //     roomId: "test_0",
    //   });
    //   System.events.emit(SystemEvent.HIDE_NAVIGATOR_MODAL);
    // }
  });

  return $container.getComponent(homeComponent);
};
