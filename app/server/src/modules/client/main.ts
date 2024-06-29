import { Application, Router, send } from "oak";
import { oakCors } from "oakCors";
import { ModuleProps } from "shared/types/main.ts";
import {initLog, isDevelopment, log} from "shared/utils/main.ts";

export const load = async (args: ModuleProps) => {
  initLog("CLIENT");
  log(`Started!`);
  // if(isDevelopment()) return;
  
  const app = new Application();
  app.use(
    oakCors({
      origin: "*",
    }),
  );
  const router = new Router();
  app.use(router.routes());
  app.use(router.allowedMethods());
  
  const ROOT_DIR = "./client", ROOT_DIR_PATH = "/";
  
  app.use(async (ctx, next) => {
    if (!ctx.request.url.pathname.startsWith(ROOT_DIR_PATH)) {
      next();
      return;
    }
    const filePath = ctx.request.url.pathname.replace(ROOT_DIR_PATH, "");
    try {
      await send(ctx, filePath || 'index.html', {
        root: ROOT_DIR,
      });
    } catch (e) {
      ctx.response.body = 404
    }
  });
  
  await app.listen({ port: args.clientPort });
};
