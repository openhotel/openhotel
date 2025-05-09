import { RequestType, getPathRequestList } from "@oh/utils";
import {
  companyDeleteRequest,
  companyPutRequest,
  companyRequest,
} from "./company.request.ts";
import {
  contractDeleteRequest,
  contractPutRequest,
  contractRequest,
  contractRespondPostRequest,
} from "./contract.request.ts";

export const requestList: RequestType[] = getPathRequestList({
  requestList: [
    companyRequest,
    companyPutRequest,
    companyDeleteRequest,

    contractRequest,
    contractPutRequest,
    contractDeleteRequest,
    contractRespondPostRequest,
  ],
  pathname: "/company",
});
