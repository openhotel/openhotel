import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
  textSprite,
} from "@tu/tulip";
import { SpriteSheetEnum, SystemEvent } from "shared/enums";
import { System } from "system";
import { buttonComponent } from "shared/components";
import { __ } from "shared/utils";

export const ownRoomsComponent: ContainerComponent = (props) => {
  const $container = container(props);

  const $text = textSprite({
    text: `OWN`,
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    color: 0,
    position: {
      x: 0,
      y: 0,
    },
  });

  const $create = buttonComponent({
    text: __("New room"),
    width: 50,
    position: {
      x: 12,
      y: 20,
    },
  });

  $create.on(DisplayObjectEvent.POINTER_TAP, () =>
    System.events.emit(SystemEvent.SHOW_ROOM_EDITOR_MODAL),
  );
  $container.add($text, $create);

  return $container.getComponent(ownRoomsComponent);
};
