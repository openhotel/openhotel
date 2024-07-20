import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
  EventMode,
  HorizontalAlign,
} from "@tulib/tulip";
import { buttonComponent, inputComponent } from "shared/components";
import { getRegisterUrl } from "shared/utils/auth.utils";

export const registerFormComponent: ContainerComponent = async (props) => {
  const $container = await container({
    ...props,
    id: "register-form",
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
  const $passwordRepeat = await inputComponent({
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

  const $registerButton = await buttonComponent({
    text: "Register",
    width: 100,
    position: {
      x: 0,
      y: 20 * 4,
    },
    eventMode: EventMode.STATIC,
  });

  $registerButton.on(DisplayObjectEvent.POINTER_TAP, async () => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const response = await fetch(getRegisterUrl(), {
      headers,
      method: "POST",
      body: JSON.stringify({
        username: $username.getValue(),
        password: $password.getValue(),
      }),
    });

    console.log(await response.json());
  });

  $container.add($username, $password, $passwordRepeat, $registerButton);

  return $container.getComponent(registerFormComponent);
};
