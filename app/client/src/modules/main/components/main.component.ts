import { container } from "@tulib/tulip";
import { logoComponent } from "./logo.component";
import { logComponent } from "./log.component";
import { System } from "system";

export const mainComponent = async () => {
  const $container = await container();

  // const { protocol, hostname } = location;
  // const isSecure = !(
  //   hostname === "localhost" ||
  //   hostname.startsWith("192.") ||
  //   hostname.startsWith("172.")
  // );

  const $logo = await logoComponent();
  await $logo.setPosition({ x: 8, y: 8 });
  $container.add($logo);
  await System.connect();
  const $log = await logComponent();

  $container.add($log);

  return $container.getComponent(mainComponent);
};
