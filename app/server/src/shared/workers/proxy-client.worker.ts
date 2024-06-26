import { getChildWorker } from "worker_ionic";

const worker = getChildWorker();

worker.on("data", ({ event, message }) => {});
