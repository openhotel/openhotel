import {
  container,
  ContainerComponent,
  Cursor,
  DisplayObjectEvent,
  EventMode,
  HorizontalAlign,
  textSprite,
} from "@tulib/tulip";
import { loginFormComponent, registerFormComponent } from "./components";
import { SpriteSheetEnum } from "shared/enums";

export const homeComponent: ContainerComponent = async () => {
  const $container = await container();

  const $registerForm = await registerFormComponent({ visible: false });
  const $loginForm = await loginFormComponent();

  const $switchText = await textSprite({
    text: "Register instead",
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    position: {
      x: 250,
      y: 20 * 6,
    },
    horizontalAlign: HorizontalAlign.CENTER,
    size: {
      width: 100,
      height: 20,
    },
    cursor: Cursor.POINTER,
    eventMode: EventMode.STATIC,
  });
  $switchText.on(DisplayObjectEvent.POINTER_TAP, () => {
    const isRegister = $registerForm.getVisible();
    $registerForm.setVisible(!isRegister);
    $loginForm.setVisible(isRegister);
    $switchText.setText(!isRegister ? "Login instead" : "Register instead");
  });

  $container.add($switchText, $registerForm, $loginForm);

  return $container.getComponent(homeComponent);
};
