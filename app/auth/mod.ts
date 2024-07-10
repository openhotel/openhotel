import { System } from "./src/main.ts";
import { load as loadEnv } from "loadenv";

loadEnv();
await System.load();
