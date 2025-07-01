import { getChildWorker } from "worker_ionic";
import { WorkerProps } from "shared/types/worker.types.ts";
import { ConfigTypes } from "shared/types/config.types.ts";
import { Envs } from "shared/types/envs.types.ts";

import puppeteer from "puppeter";
import { install } from "puppeter-browser";
import { log } from "shared/utils/log.utils.ts";
import { quantizeToPalette } from "shared/utils/image.utils.ts";

(() => {
  const serverWorker = getChildWorker();

  let $config: ConfigTypes;
  let $envs: Envs;
  let $token;

  let $executablePath;
  let $browser;
  let $killTimeout;

  let $Image;

  let captures = [];
  let isRunning = false;

  const killBrowser = async () => {
    //if negative, don't kill the browser
    if (0 > $config.phantom.sleep) return;

    const pages = await $browser.pages();
    if (pages.length > 0) return;

    clearTimeout($killTimeout);
    $killTimeout = setTimeout(() => {
      const browser = $browser;
      $browser = null;
      browser.close();
      log("Browser closed!");
    }, $config.phantom.sleep * 1000);
  };

  const launchBrowser = async () => {
    if ($browser) return;

    log("Launching browser...");
    $browser = await puppeteer.launch({
      executablePath: $executablePath,
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--single-process",
        "--no-zygote",
        "--enable-unsafe-swiftshader",
      ],
    });
    log("Browser launched!");
  };

  const load = async ({
    envs,
    config,
    token,
  }: WorkerProps & { token: string }) => {
    $config = config;
    $envs = envs;
    $token = token;

    const { Image } = await import("imagescript");
    $Image = Image;

    const browserName = `${config.phantom.browser.name}@${config.phantom.browser.buildId}`;

    log(`Installing ${browserName}...`);
    const { executablePath } = await install({
      cacheDir: Deno.cwd(),
      browser: config.phantom.browser.name,
      buildId: config.phantom.browser.buildId,
    });
    $executablePath = executablePath;
    log(`${browserName} installed!`);
  };

  const processCapture = async () => {
    const { id, size, position, room, palette, pivotFix } = captures.shift();

    await launchBrowser();

    const startTime = performance.now();
    log(`Phantom capture (${id}) in progress...`);

    try {
      const page = await $browser.newPage();
      await page.setViewport({ width: size.width, height: size.height });
      await page.setRequestInterception(true);

      page.on("request", async (req) => {
        await req.continue();
      });

      const url = new URL(`http://localhost:${$config.port}/phantom`);
      url.searchParams.append("token", $token);
      url.searchParams.append("posX", position.x);
      url.searchParams.append("posY", position.y);
      url.searchParams.append("pivotFix", pivotFix);

      await page.goto(url.href, {});

      await page.evaluate((data) => {
        localStorage.setItem("room", JSON.stringify(data));
      }, room);
      await page.waitForSelector("canvas");

      await page.waitForFunction(() => {
        const meta = document.querySelector(
          'meta[http-equiv="X-PHANTOM-LOADING-STATE"]',
        );
        //@ts-ignore
        return meta && meta.content === "DONE";
      });

      const canvas = await page.$("canvas");
      if (!canvas) return;

      const image = await canvas.screenshot();
      const imageData = (await quantizeToPalette(
        $Image,
        palette,
        image,
      )) as Uint8Array;

      serverWorker.emit("save-capture", { id, imageData: imageData.buffer });

      const duration = performance.now() - startTime;
      log(`Phantom capture (${id}) done in ${duration}ms!`);

      page.close();
    } catch (e) {
      console.error(e);
      log(`Phantom capture (${id}) error!!!`);
    }
    await killBrowser();
  };
  const processCaptures = async () => {
    if (isRunning) return;

    isRunning = true;
    while (captures.length) {
      log(`Phantom remaining ${captures.length} captures!`);
      await processCapture();
    }
    isRunning = false;
  };

  const capturePrivateRoom = ({
    id,
    room,
    position,
    size,
    palette,
    pivotFix,
  }) => {
    captures.push({ id, room, position, size, palette, pivotFix });
    processCaptures();
  };

  serverWorker.on("start", load);

  serverWorker.on("capture-private-room", capturePrivateRoom);
})();
