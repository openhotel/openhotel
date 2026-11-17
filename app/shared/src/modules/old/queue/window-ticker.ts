import {
  OnWindowTickFunction,
  WindowTickerMutable,
} from "@shared/modules/old/queue/ticker.types.ts";

/**
 * @deprecated
 */
export const windowTicker = (): WindowTickerMutable => {
  let $loopRunning = false;
  let $loopId: number | undefined = undefined;
  let $fps = 0;
  let $onTick: OnWindowTickFunction | undefined = undefined;
  let $tickCount = 0;
  let $lastFPSUpdate = 0;
  let $framesThisSecond = 0;
  let $lastNow = 0;

  const pause = () => {
    $loopRunning = false;
    if ($loopId !== undefined) {
      //@ts-ignore
      cancelAnimationFrame($loopId);
    }
  };

  const start = () => {
    $lastFPSUpdate = 0;
    $framesThisSecond = 0;
    $loopRunning = true;
    //@ts-ignore
    $loopId = requestAnimationFrame(loop);
  };

  const loop = (now: number) => {
    if (!$loopRunning) return;

    if ($lastNow === 0) $lastNow = now;
    const delta = now - $lastNow;
    $lastNow = now;

    $framesThisSecond++;

    $lastFPSUpdate += delta;
    if ($lastFPSUpdate >= 1000) {
      $fps = $framesThisSecond;
      $framesThisSecond = 0;
      $lastFPSUpdate = 0;
    }

    $onTick && $onTick({ delta, tickCount: $tickCount, fps: $fps });
    $tickCount++;

    //@ts-ignore
    $loopId = requestAnimationFrame(loop);
  };

  const onTick = (onTickCallback: OnWindowTickFunction) =>
    ($onTick = onTickCallback);

  const getFPS = (): number => $fps;

  return {
    start,
    pause,
    onTick,
    getFPS,
  };
};
