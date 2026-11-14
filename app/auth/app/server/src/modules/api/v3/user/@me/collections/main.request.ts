import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
  RequestKind,
} from "@oh/utils";
import { System } from "modules/system/main.ts";

export const mainGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request) => {
    const account = await System.accounts.getAccount({ request });

    const { accountId, restrictions, blocked } = account.getObject();
    if (restrictions || blocked) return getResponse(HttpStatusCode.LOCKED);

    if (!System.getConfig().onet.enabled)
      return getResponse(HttpStatusCode.SERVICE_UNAVAILABLE);

    try {
      const { status, data } = await System.onet.fetch<{
        collections: unknown[];
      }>({
        pathname: `/auth/collections?accountId=${encodeURIComponent(accountId)}`,
      });

      if (status !== 200) {
        console.error(`Onet collections list failed (${status})`);
        return getResponse(HttpStatusCode.SERVICE_UNAVAILABLE);
      }

      return getResponse(HttpStatusCode.OK, {
        data: { collections: data.collections },
      });
    } catch (e) {
      console.error(e);
      return getResponse(HttpStatusCode.SERVICE_UNAVAILABLE);
    }
  },
};

export const mainPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request) => {
    const account = await System.accounts.getAccount({ request });

    const { accountId, restrictions, blocked } = account.getObject();
    if (restrictions || blocked) return getResponse(HttpStatusCode.LOCKED);

    if (!System.getConfig().onet.enabled)
      return getResponse(HttpStatusCode.SERVICE_UNAVAILABLE);

    const file = new Uint8Array(await request.arrayBuffer());
    if (!file.length) return getResponse(HttpStatusCode.BAD_REQUEST);

    try {
      const { status, data } = await System.onet.fetch<{
        manifest?: unknown;
        errors?: string[];
      }>({
        method: RequestMethod.POST,
        pathname: `/auth/collections?accountId=${encodeURIComponent(accountId)}`,
        body: file,
        headers: { "content-type": "application/zip" },
      });

      if (status === 400) {
        return getResponse(HttpStatusCode.BAD_REQUEST, {
          data: { errors: data?.errors ?? [] },
        });
      }

      if (status !== 200) {
        console.error(`Onet collection publish failed (${status})`);
        return getResponse(HttpStatusCode.SERVICE_UNAVAILABLE);
      }

      return getResponse(HttpStatusCode.OK, {
        data: { manifest: data.manifest },
      });
    } catch (e) {
      console.error(e);
      return getResponse(HttpStatusCode.SERVICE_UNAVAILABLE);
    }
  },
};
