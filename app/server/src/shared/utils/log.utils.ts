let $name;

export const initLog = (name: string) => {
  $name = name;
  console.log = () => {};
};

export const log = (...messages: string[]) => {
  console.info(`「${$name}」`, ...messages);
};
