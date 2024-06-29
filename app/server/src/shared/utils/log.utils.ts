let $name;

export const initLog = (name: string) => {
  $name = name;
  console.log = () => {};
};

export const log = (...messages: string[]) => {
  console.info(`> ${new Date().toISOString()} | ${$name} |`, ...messages);
};

export const debug = (...messages: string[]) => {
  console.debug(`>>> ${new Date().toISOString()} | ${$name} |`, ...messages);
};
