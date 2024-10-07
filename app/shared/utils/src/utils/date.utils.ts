import dayjs from "dayjs";

export const getBeautyDate = (): string =>
  dayjs().format("YY-MM-DD HH:mm:ss:SSS");
