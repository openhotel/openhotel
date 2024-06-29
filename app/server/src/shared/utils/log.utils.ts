import { getBeautyDate } from "./date.utils.ts";

export const initLog = () => {
  console.log = () => {};
};

export const log = (...messages: string[]) => {
  console.info(`${getBeautyDate()}`, "|", ...messages);
};

export const debug = (...messages: string[]) => {
  console.info(`> ${getBeautyDate()}`, "|", ...messages);
};
