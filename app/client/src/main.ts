import { application } from "@tulib/tulip";
import { mainComponent } from "modules/main";

application({
  backgroundColor: 0x030303,
  scale: 2,
  //@ts-ignore
  importMetaEnv: import.meta.env,
  //@ts-ignore
  importMetaHot: import.meta.hot,
}).then(async ({ add }) => {
  add(await mainComponent());
});
