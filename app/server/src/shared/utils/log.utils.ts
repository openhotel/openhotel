export const initLog = () => {
  console.log = () => {};
};

export const log = (...messages: string[]) => {
  console.info(`> ${new Date().toISOString()}`, "|", ...messages);
};

export const debug = (...messages: string[]) => {
  console.info(`>>> ${new Date().toISOString()}`, "|", ...messages);
};
