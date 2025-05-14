import { getChildWorker } from "worker_ionic";

(() => {
  const worker = getChildWorker();

  worker.on("start", async ({ manifest, createServer }) => {
    console.log(`Game server starting: ${manifest.id}`);

    const emit = (data) => {
      worker.emit("game:event:emit", data);
    };

    const on = () => {};

    const gameServer = createServer({});

    worker.on("game:event", (data) => {
      gameServer.handleEvent(data);
    });

    worker.on("stop", () => {
      gameServer.shutdown();
      console.log(`Game server stopped: ${manifest.id}`);
    });

    console.log(`Game server started: ${manifest.id}`);
  });
})();
