import { RequestType } from "../types/main.ts";

export const getPathRequestList = ({
  requestList,
  pathname,
}: {
  requestList: RequestType<unknown>[];
  pathname: string;
}): RequestType<unknown>[] =>
  requestList.map((request) => ({
    ...request,
    pathname: `${pathname}${request.pathname}`,
  }));
