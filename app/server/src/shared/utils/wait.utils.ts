export const wait = async (time: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, time));
