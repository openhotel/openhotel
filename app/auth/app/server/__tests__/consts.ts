import { LANGUAGE_LIST } from "../src/shared/consts/language.consts.ts";
import { Scope } from "../src/shared/enums/scopes.enums.ts";

export const USER_1 = {
  email: "Jorji@Obristan.obr",
  username: "Jorji",
  password: "*dry$yVnidc0Utp}_Da*($P}kQ&_M{",
  languages: [
    LANGUAGE_LIST[2].code,
    LANGUAGE_LIST[20].code,
    LANGUAGE_LIST[42].code,
  ],

  connectionScopes: [Scope.ONET_MESSAGES_READ, Scope.ONET_MESSAGES_WRITE],
};

export const USER_2 = {
  email: "Frank@bobba.su",
  username: "Frank",
  password: "*}_DaP}}kQ&_VndUtpkQ&_V*($P",
  languages: [LANGUAGE_LIST[1].code],

  connectionScopes: [Scope.ONET_MESSAGES_READ, Scope.ONET_FRIENDS_WRITE],
};

export const INVALID_USERNAMES = ["  asd", "_", "1", "%asdsa", "$#(&%"];
export const INVALID_EMAILS = ["asdasd", "asd@asdasd", "asdasd.com"];
export const INVALID_PASSWORD = ["abde345"];
export const INVALID_LANGUAGE = ["arstotzkan"];

export const HOTEL_1 = {
  name: "public hotel 1",
  public: true,
  integration_1: {
    name: "integration A",
    redirectUrl: "http://localhost:1994",
    type: "client",
  },
};

export const HOTEL_2 = {
  name: "private hotel 2",
  public: false,
};

export const USER_AGENTS = {
  FIREFOX:
    "Mozilla/5.0 (X11; Linux x86_64; rv:135.0) Gecko/20100101 Firefox/135.0",
  CHROME:
    "Mozilla/5.0 (X11; Windows NT 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
};
