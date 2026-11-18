export const wait = async (time: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, time));

export const waitUntil = async (
  callback: () => Promise<boolean>,
  intervalTime = 100,
  retires = 10,
): Promise<void> =>
  new Promise((resolve, reject) => {
    let iteration = 0;
    const interval = setInterval(async () => {
      if (await callback()) {
        clearInterval(interval);
        resolve();
      }
      if (iteration > retires) {
        clearInterval(interval);
        reject();
      }
      iteration++;
    }, intervalTime);
  });
