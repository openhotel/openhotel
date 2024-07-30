import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
  EventMode,
  HorizontalAlign,
} from "@tulib/tulip";
import { buttonComponent, inputComponent } from "shared/components";
import { System } from "system";
import {
  getCaptchaComponent,
  getRandomString,
  isDevelopment,
} from "shared/utils";

export const loginFormComponent: ContainerComponent = async (props) => {
  const $container = await container({
    ...props,
    id: "login-form",
    position: {
      x: 250,
      y: 20,
    },
  });

  const $username = await inputComponent({
    placeholder: "username",
    horizontalAlign: HorizontalAlign.CENTER,
    width: 100,
    maxLength: 16,
    password: false,
    defaultValue:
      localStorage.getItem("username") ||
      (isDevelopment() ? `player_${getRandomString(8)}` : ""),
    onTextChange: (_, username) => {
      localStorage.setItem("username", username);
      return true;
    },
  });
  const $password = await inputComponent({
    placeholder: "password",
    horizontalAlign: HorizontalAlign.CENTER,
    width: 100,
    maxLength: 16,
    password: true,
    position: {
      x: 0,
      y: 20,
    },
  });

  const $captchaComponent = await getCaptchaComponent();
  $captchaComponent && $container.add($captchaComponent);
  await $captchaComponent?.setPosition({
    x: -8,
    y: 20 * 2,
  });

  const $loginButton = await buttonComponent({
    text: "Login",
    width: 100,
    position: {
      x: 0,
      y: 20 * 7,
    },
    eventMode: EventMode.STATIC,
  });
  $loginButton.on(DisplayObjectEvent.POINTER_TAP, async () => {
    try {
      await System.proxy.connect({
        username: $username.getValue(),
        password: $password.getValue(),
        captchaId: $captchaComponent?.getCaptchaId(),
      });
    } catch (e) {
      $password.clear();
      $captchaComponent?.refresh();
    }
  });

  $container.add($username, $password, $loginButton);

  if (isDevelopment()) {
    try {
      if (localStorage.getItem("auto-connect") === null)
        localStorage.setItem("auto-connect", "true");

      // if (localStorage.getItem("auto-connect") === "true")
      // System.proxy.connect({
      //   username: $username.getValue() || `player_${getRandomString(8)}`,
      //   password: $password.getValue(),
      // });
    } catch (e) {}
  }

  return $container.getComponent(loginFormComponent);
};
