import { container, ContainerComponent } from "@tulib/tulip";
import { loginFormComponent, registerFormComponent } from "./components";

export const homeComponent: ContainerComponent = async () => {
  const $container = await container();

  const $registerForm = await registerFormComponent();
  const $loginForm = await loginFormComponent();
  $container.add($loginForm);

  return $container.getComponent(homeComponent);
};
