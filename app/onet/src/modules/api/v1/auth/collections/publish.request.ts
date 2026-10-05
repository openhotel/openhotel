import {
  getResponse,
  HttpStatusCode,
  RequestMethod,
  RequestType,
  RequestKind,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import { getCollectionPublishProps } from "shared/utils/main.ts";

export const publishRequest: RequestType<unknown> = {
  method: RequestMethod.POST,
  pathname: "",
  kind: RequestKind.APPS,
  func: async (request, url) => {
    const accountId = url.searchParams.get("accountId");
    if (!accountId) return getResponse(HttpStatusCode.BAD_REQUEST);

    if (!System.collections.isBucketEnabled()) {
      return getResponse(HttpStatusCode.SERVICE_UNAVAILABLE);
    }

    const file = new Uint8Array(await request.arrayBuffer());
    if (!file.length) {
      return getResponse(HttpStatusCode.BAD_REQUEST, {
        data: { errors: ["file is empty"] },
      });
    }

    const { props, errors } = await getCollectionPublishProps(accountId, file);
    if (!props) {
      return getResponse(HttpStatusCode.BAD_REQUEST, { data: { errors } });
    }

    const result = await System.collections.publish(props);
    if (result.errors) {
      return getResponse(HttpStatusCode.BAD_REQUEST, {
        data: { errors: result.errors },
      });
    }

    return getResponse(HttpStatusCode.OK, {
      data: { manifest: result.manifest },
    });
  },
};
