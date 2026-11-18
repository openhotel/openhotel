import { RequestType } from "@shared/types/request.types.ts";

export const getPathRequestList = ({
  requestList,
  pathname,
}: {
  requestList: RequestType<unknown>[];
  pathname: string;
}): RequestType<unknown>[] =>
  requestList.map((request) => ({
    ...request,
    pathname: request.pathname ? `${pathname}${request.pathname}` : pathname,
  }));
