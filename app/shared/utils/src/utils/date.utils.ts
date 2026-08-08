import { dayjs } from "@xtool/dayjs";

export const getBeautyDate = (): string =>
  dayjs().format("YY-MM-DD HH:mm:ss:SSS");

export const getUtilDate = (): string => dayjs().format("YYYYMMDD_HHmmssSSS");
