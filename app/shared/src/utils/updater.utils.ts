export const getGithubHeaders = (accept: string = "application/json") =>
  new Headers({
    "X-GitHub-Api-Version": "2026-03-10",
    Accept: accept,
    "User-Agent":
      "Mozilla/5.0 (X11; Linux x86_64; rv:160.0) Gecko/20100101 Firefox/160.0",
    "Accept-Encoding": "br, deflate, gzip, x-gzip",
  });
