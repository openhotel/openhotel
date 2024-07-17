import {
  container,
  ContainerComponent,
  Cursor,
  DisplayObjectEvent,
  EventMode,
  inputTextSprite,
} from "@tulib/tulip";
import { SpriteSheetEnum } from "shared/enums";

export const inputComponent: ContainerComponent = async (props) => {
  const $container = await container(props);

  const $input = await inputTextSprite({
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    color: 0xffffff,
    eventMode: EventMode.STATIC,
    cursor: Cursor.TEXT,
    editable: true,
    withContext: true,
    backgroundColor: 0xff00ff,
    backgroundAlpha: 1,
    size: {
      width: 100,
      height: 7,
    },
    backgroundPadding: [4, 8, 3, 8],
    placeholder: "username",
    maxLength: 20,
  });
  $input.on(DisplayObjectEvent.POINTER_TAP, () => {
    console.log($input.getText());
    $input.focus();
  });
  $container.add($input);

  return $container.getComponent(inputComponent);
};
