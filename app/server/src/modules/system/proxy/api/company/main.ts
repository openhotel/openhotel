import { RequestType, getPathRequestList } from "@oh/utils";
import {
  companyDeleteRequest,
  companyPutRequest,
  companyRequest,
} from "./company.request.ts";

export const requestList: RequestType[] = getPathRequestList({
  requestList: [companyRequest, companyPutRequest, companyDeleteRequest],
  pathname: "/company",
});
