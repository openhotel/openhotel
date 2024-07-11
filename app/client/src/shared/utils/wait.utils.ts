export const waitUntil = (callback: () => boolean) =>
  new Promise((resolve) => {
    const interval = setInterval(() => {
      if (callback()) {
        resolve(1);
        clearInterval(interval);
      }
    }, 100);
  });
