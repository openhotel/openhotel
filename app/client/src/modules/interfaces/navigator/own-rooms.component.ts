import {
  container,
  ContainerComponent,
  Cursor,
  DisplayObjectEvent,
  EventMode,
  textSprite,
} from "@tu/tulip";
import { SpriteSheetEnum, SystemEvent } from "shared/enums";
import { System } from "../../../system";

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

  // TODO: change to button
  const $create = textSprite({
    text: `create one`,
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    color: 0,
    position: {
      x: 0,
      y: 20,
    },
    eventMode: EventMode.STATIC,
    cursor: Cursor.POINTER,
    backgroundColor: 0x00fffff,
  });

  $create.on(DisplayObjectEvent.POINTER_DOWN, () => {
    console.log("open editor");
    System.events.emit(SystemEvent.SHOW_ROOM_EDITOR_MODAL);
  });
  $container.add($text, $create);

  return $container.getComponent(ownRoomsComponent);
};
