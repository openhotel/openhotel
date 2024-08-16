export const wait = async (time: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, time));

export const waitUntil = async (
  callback: () => boolean,
  intervalTime = 100,
  retires = 10,
): Promise<void> =>
  new Promise((resolve, reject) => {
    let iteration = 0;
    const interval = setInterval(() => {
      if (callback()) {
        clearInterval(interval);
        resolve();
      }
      if (iteration > retires) {
        clearInterval(interval);
        reject(`waitUntil failed on ${callback}!`);
      }
      iteration++;
    }, intervalTime);
  });
