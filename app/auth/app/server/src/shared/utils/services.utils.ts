import { Service } from "shared/enums/services.enums.ts";

export const isServiceValid = (service: string): boolean =>
  Service[service] !== undefined;
