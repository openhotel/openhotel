import {
  RequestMethod,
  RequestType,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { RequestKind } from "shared/enums/request.enums.ts";
import { System } from "modules/system/main.ts";
import { LANGUAGE_LIST } from "shared/consts/language.consts.ts";

export const mainGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "",
  kind: [RequestKind.ACCOUNT, RequestKind.CONNECTION],
  func: async (request: Request) => {
    const account = await System.accounts.getAccount({ request });
    const admin = await account.isAdmin();
    const accountData = account.getObject();

    return getResponse(HttpStatusCode.OK, {
      data: {
        accountId: accountData.accountId,
        username: accountData.username,
        languages: accountData.languages,
        githubLogin: accountData.githubLogin,
        ...(admin ? { admin } : {}),
      },
    });
  },
};

export const mainPatchRequest: RequestType = {
  method: RequestMethod.PATCH,
  pathname: "",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request) => {
    let { languages } = await request.json();

    if (
      !languages?.length ||
      languages.find((language) => !LANGUAGE_LIST.includes(language))
    )
      return getResponse(HttpStatusCode.BAD_REQUEST, {
        message: "Language is not valid!",
      });

    const account = await System.accounts.getAccount({ request });

    await account.update({
      languages,
    });

    return getResponse(HttpStatusCode.OK);
  },
};
