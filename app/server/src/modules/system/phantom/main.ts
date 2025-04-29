import { WorkerParent, getParentWorker } from "worker_ionic";
import { System } from "modules/system/main.ts";
import { getRandomString } from "@oh/utils";
import { ulid } from "@std/ulid";

export const phantom = () => {
  let $worker: WorkerParent;
  const $token = getRandomString(16);

  const load = () => {
    const config = System.config.get();
    const envs = System.getEnvs();

    $worker = getParentWorker({
      url: new URL("../../phantom/main.ts", import.meta.url).href,
    });
    $worker.emit("start", {
      config,
      envs,
      token: $token,
    });
    $worker.on("save-capture", ({ id, imageData }) => {
      System.db.set(["captures", id], imageData);
    });
  };

  const capture = ({ room, position, size, palette }) => {
    const id = ulid();
    $worker.emit("capture-private-room", {
      id,
      room,
      position,
      size,
      palette,
    });
    return id;
  };

  const getCapture = async (id: string) => {
    const capture = await System.db.get(["captures", id]);
    return capture ?? null;
  };

  const isTokenValid = (token: string) =>
    $token === token || System.config.isDevelopment();

  return {
    load,
    capture,
    getCapture,
    isTokenValid,
  };
};
