import { RequestType, getPathRequestList } from "@oh/utils";

import { importRequest } from "./import.request.ts";
import { furnitureRequest } from "./furniture.request.ts";
import { createRequest } from "./create.request.ts";

export const collectionList: RequestType[] = getPathRequestList({
  requestList: [importRequest, furnitureRequest, createRequest],
  pathname: "/collection",
});
