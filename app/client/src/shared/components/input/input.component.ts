import {
  container,
  ContainerComponent,
  Cursor,
  DisplayObjectEvent,
  EventMode,
  graphics,
  GraphicType,
  inputTextSprite,
} from "@tulib/tulip";
import { SpriteSheetEnum } from "shared/enums";

export const inputComponent: ContainerComponent = async (props) => {
  const $container = await container(props);

  const $background = await graphics({
    type: GraphicType.RECTANGLE,
    width: 100,
    height: 20,
    color: 0xff00ff,
    withContext: true,
    eventMode: EventMode.STATIC,
    cursor: Cursor.TEXT,
  });

  const $input = await inputTextSprite({
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    color: 0xffffff,
    eventMode: EventMode.NONE,
    editable: true,
    withContext: true,
  });
  $background.on(DisplayObjectEvent.POINTER_TAP, () => {
    console.log('"""');
    $input.focus();
  });
  $container.add($background, $input);

  return $container.getComponent(inputComponent);
};
