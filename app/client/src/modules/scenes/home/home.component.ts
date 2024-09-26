import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
  textSprite,
} from "@tu/tulip";
import { logoComponent } from "modules/main";
import { hotBarComponent } from "modules/interfaces";
import { System } from "system";
import { SpriteSheetEnum, SystemEvent } from "shared/enums";
import { getConfig } from "shared/utils";

type Props = {};

export const homeComponent: ContainerComponent<Props> = () => {
  const $container = container();

  const $logo = logoComponent();
  $logo.setPosition({ x: 10, y: 20 });

  const { name, description } = getConfig();

  const $name = textSprite({
    spriteSheet: SpriteSheetEnum.BOLD_FONT,
    text: name,
  });
  $name.setPosition({ x: 60, y: 90 });
  const $description = textSprite({
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    text: description,
  });
  $description.setPosition({ x: 60, y: 98 });
  $container.add($name, $description);

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
