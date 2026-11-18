export enum RequestMethod {
  OPTIONS = "OPTIONS",
  GET = "GET",
  HEAD = "HEAD",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  TRACE = "TRACE",
  CONNECT = "CONNECT",
  PATCH = "PATCH",
}

export enum RequestKind {
  PUBLIC,
  ACCOUNT,
  ACCOUNT_REFRESH,
  LICENSE,
  CONNECTION,
  ADMIN,
  TOKEN,
  APPS,
}
