import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
  EventMode,
  HorizontalAlign,
} from "@tulib/tulip";
import {
  buttonComponent,
  inputComponent,
  loaderComponent,
} from "shared/components";
import { getRegisterUrl } from "shared/utils/auth.utils";
import { getCaptchaComponent } from "shared/utils";

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
    placeholder: "username",
    horizontalAlign: HorizontalAlign.CENTER,
    width: 100,
    maxLength: 16,
    password: false,
  });
  const $password = inputComponent({
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
  const $passwordRepeat = inputComponent({
    placeholder: "repeat password",
    horizontalAlign: HorizontalAlign.CENTER,
    width: 100,
    maxLength: 16,
    password: true,
    position: {
      x: 0,
      y: 20 * 2,
    },
  });

  const $captchaComponent = getCaptchaComponent();
  $captchaComponent && $container.add($captchaComponent);
  $captchaComponent?.setPosition({
    x: -8,
    y: 20 * 3,
  });

  const $registerButton = buttonComponent({
    text: "Register",
    width: 100,
    position: {
      x: 0,
      y: 20 * 7,
    },
    eventMode: EventMode.STATIC,
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

  return $container.getComponent(registerFormComponent);
};
