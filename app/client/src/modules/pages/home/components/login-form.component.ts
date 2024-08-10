import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
  EventMode,
  HorizontalAlign,
} from "@tu/tulip";
import {
  buttonComponent,
  inputComponent,
  loaderComponent,
} from "shared/components";
import { System } from "system";
import {
  __,
  getCaptchaComponent,
  getRandomString,
  isDevelopment,
} from "shared/utils";

export const loginFormComponent: ContainerComponent = (props) => {
  const $container = container({
    ...props,
    id: "login-form",
    position: {
      x: 250,
      y: 20,
    },
  });

  const $username = inputComponent({
    placeholder: __("username"),
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

  $username.on(DisplayObjectEvent.CONTEXT_FORWARD, () => {
    $password.focus();
  });

  const $password = inputComponent({
    placeholder: __("password"),
    horizontalAlign: HorizontalAlign.CENTER,
    width: 100,
    maxLength: 16,
    password: true,
    position: {
      x: 0,
      y: 20,
    },
  });
  $password.on(DisplayObjectEvent.CONTEXT_FORWARD, () => {
    $loginButton.focus();
  });
  $password.on(DisplayObjectEvent.CONTEXT_BACKWARD, () => {
    $username.focus();
  });

  const $captchaComponent = getCaptchaComponent();
  $captchaComponent && $container.add($captchaComponent);
  $captchaComponent?.setPosition({
    x: -8,
    y: 20 * 2,
  });

  const $loginButton = buttonComponent({
    text: __("Login"),
    width: 100,
    position: {
      x: 0,
      y: 20 * 7,
    },
    eventMode: EventMode.STATIC,
  });
  $loginButton.on(DisplayObjectEvent.CONTEXT_BACKWARD, () => {
    $password.focus();
  });

  const $loader = loaderComponent({
    visible: false,
    position: {
      x: 50,
      y: 20 * 7 + 2,
    },
  });

  $loginButton.on(DisplayObjectEvent.POINTER_TAP, async () => {
    try {
      $loginButton.setVisible(false);
      $loader.setVisible(true);

      await System.proxy.connect({
        username: $username.getValue(),
        password: $password.getValue(),
        captchaId: $captchaComponent?.getCaptchaId(),
      });
    } catch (e) {
      $password.clear();
      $captchaComponent?.refresh();

      $loader.setVisible(false);
      $loginButton.setVisible(true);
    }
  });

  $container.add($username, $password, $loginButton, $loader);

  $container.on(DisplayObjectEvent.ADDED, () => {
    $username.focus();
  });

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
