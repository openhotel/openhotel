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
import { RequestType } from "@shared/types/request.types.ts";
import { getPathRequestList } from "@shared/utils/request.utils.ts";

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
