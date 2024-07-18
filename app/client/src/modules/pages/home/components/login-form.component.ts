import {
  container,
  DisplayObjectEvent,
  EventMode,
  HorizontalAlign,
} from "@tulib/tulip";
import { buttonComponent, inputComponent } from "shared/components";
import { getConfig } from "shared/utils";

export const loginFormComponent = async () => {
  const $container = await container({
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

  const $loginButton = await buttonComponent({
    text: "Login",
    width: 100,
    position: {
      x: 0,
      y: 54,
    },
    eventMode: EventMode.STATIC,
  });

  const loginUrl = `${getConfig().auth.url}/v1/account/login`;

  $loginButton.on(DisplayObjectEvent.POINTER_TAP, async () => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const response = await fetch(loginUrl, {
      headers,
      method: "POST",
      body: JSON.stringify({
        username: $username.getValue(),
        password: $password.getValue(),
      }),
    });

    console.log(await response.json());
  });

  $container.add($username, $password, $loginButton);

  return $container.getComponent(loginFormComponent);
};
