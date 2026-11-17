import { RequestKind, RequestMethod } from "@shared/enums/request.enums.ts";

export interface ApiHandlerProps<RequestKindT extends number = RequestKind> {
  requests: RequestType[];
  testMode?: boolean;
  checkAccess?: CheckAccess;
  requestKindEnum?: Record<RequestKindT, string>;
  requestKindColorMap?: Record<RequestKindT, string>;
}

export type ApiHandlerMutable = {
  overview: () => void;
  on: (request: Request) => Promise<Response>;
};

export type RequestType<Data = undefined> = {
  pathname: string;
  method: RequestMethod;
  kind: RequestKind | RequestKind[];
  func: (
    request: Request,
    url: URL,
    data?: Data,
  ) => Response | Promise<Response>;
};

export type CheckAccess = (params: {
  request: Request;
  kind: RequestKind | RequestKind[];
}) => Promise<boolean>;
