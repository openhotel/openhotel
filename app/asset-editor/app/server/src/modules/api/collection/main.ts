import { importRequest } from "./import.request.ts";
import { furnitureRequest } from "./furniture.request.ts";
import { createRequest } from "./create.request.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { getPathRequestList } from "@shared/utils/request.utils.ts";

export const collectionList: RequestType[] = getPathRequestList({
  requestList: [importRequest, furnitureRequest, createRequest],
  pathname: "/collection",
});
