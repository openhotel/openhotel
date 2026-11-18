import {
  OnTickFunction,
  TickerConfig,
  TickerMutable,
} from "@shared/modules/old/queue/ticker.types.ts";

/**
 * @deprecated
 */
export const ticker = (): TickerMutable => {
  let $loopRunning = false;
  let $loopId: number | undefined = undefined;
  let $ticks: number | null;
  let $intervalTicks: number | null;
  let $onTick: OnTickFunction | undefined = undefined;
  let $lastTick = performance.now();
  let $tickCount = 0;
  let $lastNow = performance.now();

  const load = ({ ticks }: TickerConfig = {}) => {
    $ticks = ticks ?? null;
    if ($ticks) $intervalTicks = 1000 / $ticks;
  };

  const pause = () => {
    clearTimeout($loopId);
    $loopRunning = false;
  };

  const start = () => {
    $lastTick = performance.now();
    $loopRunning = true;
    loop();
  };

  const loop = () => {
    const now = performance.now();
    const delta = now - $lastTick;

    if ($intervalTicks && delta > $intervalTicks)
      $lastTick = now - (delta % $intervalTicks);

    const ms = performance.now() - $lastNow;
    const usage = $intervalTicks
      ? Math.trunc((delta / $intervalTicks) * 100) / 100
      : null;
    $onTick && $onTick({ delta, ms, usage, tickCount: $tickCount });

    $tickCount++;

    if (!$loopRunning) return;
    $loopId = $intervalTicks
      ? setTimeout(loop, $intervalTicks)
      : setTimeout(loop);
    $lastTick = now;
    $lastNow = performance.now();
  };

  const onTick = (onTickCallback: OnTickFunction) => ($onTick = onTickCallback);

  const getTicks = (): number | null => $ticks;

  return {
    load,
    start,
    pause,
    onTick,
    getTicks,
  };
};
