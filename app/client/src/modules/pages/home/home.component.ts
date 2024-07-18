import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
  EventMode,
  HorizontalAlign,
} from "@tulib/tulip";
import { inputComponent } from "shared/components";
import { buttonComponent } from "shared/components/button";

export const homeComponent: ContainerComponent = async () => {
  const $container = await container({
    id: "homeComponent",
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

  const $registerButton = await buttonComponent({
    text: "Register",
    width: 100,
    position: {
      x: 0,
      y: 54,
    },
    eventMode: EventMode.STATIC,
  });
  $registerButton.on(DisplayObjectEvent.POINTER_TAP, () => {
    console.log($username.getValue(), $password.getValue());
  });

  console.log("?");
  $container.add($username, $password, $registerButton);

  return $container.getComponent(homeComponent);
};
