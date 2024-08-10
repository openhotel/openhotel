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
import { getRegisterUrl } from "shared/utils/auth.utils";
import { __, getCaptchaComponent } from "shared/utils";

export const registerFormComponent: ContainerComponent = (props) => {
  const $container = container({
    ...props,
    id: "register-form",
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
    $passwordRepeat.focus();
  });
  $password.on(DisplayObjectEvent.CONTEXT_BACKWARD, () => {
    $username.focus();
  });
  const $passwordRepeat = inputComponent({
    placeholder: __("repeat password"),
    horizontalAlign: HorizontalAlign.CENTER,
    width: 100,
    maxLength: 16,
    password: true,
    position: {
      x: 0,
      y: 20 * 2,
    },
  });
  $passwordRepeat.on(DisplayObjectEvent.CONTEXT_FORWARD, () => {
    $registerButton.focus();
  });
  $passwordRepeat.on(DisplayObjectEvent.CONTEXT_BACKWARD, () => {
    $password.focus();
  });

  const $captchaComponent = getCaptchaComponent();
  $captchaComponent && $container.add($captchaComponent);
  $captchaComponent?.setPosition({
    x: -8,
    y: 20 * 3,
  });

  const $registerButton = buttonComponent({
    text: __("Register"),
    width: 100,
    position: {
      x: 0,
      y: 20 * 7,
    },
    eventMode: EventMode.STATIC,
  });
  $registerButton.on(DisplayObjectEvent.CONTEXT_BACKWARD, () => {
    $passwordRepeat.focus();
  });

  const $loader = loaderComponent({
    visible: false,
    position: {
      x: 50,
      y: 20 * 7 + 2,
    },
  });

  $registerButton.on(DisplayObjectEvent.POINTER_TAP, async () => {
    $registerButton.setVisible(false);
    $loader.setVisible(true);

    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const $clear = () => {
      $password.clear();
      $captchaComponent?.refresh();

      $loader.setVisible(false);
      $registerButton.setVisible(true);
    };

    try {
      const response = await fetch(getRegisterUrl(), {
        headers,
        method: "POST",
        body: JSON.stringify({
          username: $username.getValue(),
          password: $password.getValue(),
          captchaId: $captchaComponent?.getCaptchaId(),
        }),
      });
      const { status } = await response.json();
      if (status !== 200) $clear();
    } catch (e) {
      $clear();
    }
  });

  $container.add(
    $username,
    $password,
    $passwordRepeat,
    $registerButton,
    $loader,
  );
  $container.on(DisplayObjectEvent.ADDED, () => {
    $username.focus();
  });

  return $container.getComponent(registerFormComponent);
};
