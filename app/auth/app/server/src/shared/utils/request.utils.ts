import { RequestType } from "../types/main.ts";

export const getPathRequestList = ({
  requestList,
  pathname,
}: {
  requestList: RequestType[];
  pathname: string;
}): RequestType[] =>
  requestList.map((request) => ({
    ...request,
    pathname: `${pathname}${request.pathname}`,
  }));
