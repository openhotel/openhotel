import dayjs from "dayjs";

export const getBeautyDate = () => dayjs().format("YY-MM-DD HH:mm:ss:SSS");
