import {
  container,
  ContainerComponent,
  Cursor,
  DisplayObjectEvent,
  EventMode,
  HorizontalAlign,
  textSprite,
} from "@tu/tulip";
import { SpriteSheetEnum } from "shared/enums";
import { registerFormComponent } from "./register-form.component";
import { loginFormComponent } from "./login-form.component";
import { __ } from "shared/utils";

export const homeComponent: ContainerComponent = () => {
  const $container = container();

  const $registerForm = registerFormComponent({ visible: false });
  const $loginForm = loginFormComponent();

  const $switchText = textSprite({
    text: __("Register instead"),
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    position: {
      x: 250,
      y: 20 * 9,
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
    $switchText.setText(
      !isRegister ? __("Login instead") : __("Register instead"),
    );
  });

  $container.add($switchText, $registerForm, $loginForm);

  return $container.getComponent(homeComponent);
};
