import { WorkerParent, getParentWorker } from "worker_ionic";
import { System } from "modules/system/main.ts";
import { ulid } from "@std/ulid";

export const phantom = () => {
  let $worker: WorkerParent;

  const load = () => {
    const config = System.config.get();
    if (!config.phantom.enabled) return;

    const envs = System.getEnvs();

    $worker = getParentWorker({
      url: new URL("../../phantom/main.ts", import.meta.url).href,
    });
    $worker.emit("start", {
      config,
      envs,
      token: System.getToken(),
    });
    $worker.on("save-capture", ({ id, imageData }) => {
      System.db.set(["captures", id], imageData);
    });
  };

  const capture = ({ id, room, position, size, palette, pivotFix }: any) => {
    const config = System.config.get();
    if (!config.phantom.enabled) return;

    const $id = id ?? ulid();
    $worker.emit("capture-private-room", {
      id: $id,
      room,
      position,
      size,
      palette,
      pivotFix,
    });
    return $id;
  };

  const getCapture = async (id: string) => {
    const capture = await System.db.get(["captures", id]);
    return capture ?? null;
  };

  const getCaptureList = async () => {
    const { items } = await System.db.list({
      prefix: ["captures"],
    });

    return items.map((item) => item.key[1]);
  };

  return {
    load,
    capture,
    getCapture,
    getCaptureList,
  };
};
