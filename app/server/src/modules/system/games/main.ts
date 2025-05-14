import { WorkerParent, getParentWorker } from "worker_ionic";
import { GameManifest } from "@oh/utils";

export const games = () => {
  const $gameWorkers: Record<string, WorkerParent> = {};
  const $gameManifests: Record<string, GameManifest> = {};

  const load = async () => {
    // TODO: request onet
    const manifests: GameManifest[] = [
      {
        id: "sample-game",
        name: "Sample Game",
        description: "This is a sample game for testing purposes.",
        type: "window",
        version: "0.0.1",
        author: "OpenHotel",
        clientUrl: "http://localhost:8000/bundle.js",
      },
    ];

    for (const manifest of manifests) {
      if (!manifest.id) {
        console.error("Game manifest without id", manifest);
        continue;
      }

      if ($gameManifests[manifest.id]) {
        console.error("Game manifest already registered", manifest);
        continue;
      }

      if (!manifest.clientUrl) {
        console.error("Game manifest without clientUrl", manifest);
        continue;
      }

      $gameManifests[manifest.id] = manifest;
    }
  };

  const startGameServer = async (gameId: string) => {
    const manifest = $gameManifests[gameId];
    if (!manifest || !manifest.serverUrl) return false;

    if ($gameWorkers[gameId]) return true;

    $gameWorkers[gameId] = getParentWorker({
      url: manifest.serverUrl,
    });

    // TODO: define props for game server
    $gameWorkers[gameId].emit("start", {});

    $setupGameEvents(gameId);

    return true;
  };

  const stopGameServer = async (gameId: string) => {
    if (!$gameWorkers[gameId]) return false;

    $gameWorkers[gameId].emit("stop");
    delete $gameWorkers[gameId];
    return true;
  };

  const $setupGameEvents = (gameId: string) => {
    const worker = $gameWorkers[gameId];
    if (!worker) return;

    worker.on("game:request", (data) => {
      // TODO:!
      // worker -> oh server
      // Calls from minigame worker to oh server, example: to get user data
    });

    worker.on("game:user-event", ({ userId, event, data }) => {
      // TODO:!
      // worker -> minijuego client
      // Calls from minigame worker to minigame client
    });
  };

  const getWorker = (gameId: string) => {
    return $gameWorkers[gameId];
  };

  const getManifests = () => Object.values($gameManifests);
  const getManifest = (gameId: string) => $gameManifests[gameId] || null;

  return {
    load,

    getWorker,

    startGameServer,
    stopGameServer,

    getManifests,
    getManifest,
  };
};
