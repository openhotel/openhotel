import {
  RequestMethod,
  RequestType,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";
import { RequestKind } from "shared/enums/request.enums.ts";
import { System } from "modules/system/main.ts";
import { LANGUAGE_LIST } from "shared/consts/language.consts.ts";

export const mainGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "",
  kind: RequestKind.CONNECTION,
  func: async (request: Request) => {
    if (!(await hasRequestAccess({ request, scopes: [] })))
      return getResponse(HttpStatusCode.FORBIDDEN);

    const account = await System.accounts.getFromRequest(request);
    const admin = Boolean(await System.admins.get(account.accountId));

    const githubData = await System.db.get(["github", account.accountId]);

    return getResponse(HttpStatusCode.OK, {
      data: {
        accountId: account.accountId,
        username: account.username,
        languages: account.languages,
        ...(githubData?.login ? { githubLogin: githubData?.login } : {}),
        ...(admin ? { admin } : {}),
      },
    });
  },
};

export const mainPatchRequest: RequestType = {
  method: RequestMethod.PATCH,
  pathname: "",
  kind: RequestKind.CONNECTION,
  func: async (request: Request) => {
    if (!(await hasRequestAccess({ request, scopes: [] })))
      return getResponse(HttpStatusCode.FORBIDDEN);

    let { languages } = await request.json();

    if (
      !languages?.length ||
      languages.find((language) => !LANGUAGE_LIST.includes(language))
    )
      return getResponse(HttpStatusCode.BAD_REQUEST, {
        message: "Language is not valid!",
      });

    const account = await System.accounts.getFromRequest(request);

    await System.db.set(["accounts", account.accountId], {
      ...account,
      languages,
    });

    return getResponse(HttpStatusCode.OK);
  },
};
