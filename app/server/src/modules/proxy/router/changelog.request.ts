import { Proxy } from "modules/proxy/main.ts";
import {
  parseChangelog,
  getChangesBetweenVersions,
} from "shared/utils/changelog.utils.ts";

export const getChangelogRequest = {
  method: "GET",
  pathname: "/changelog",
  fn: async (request: Request): Promise<Response> => {
    const url = new URL(request.url);
    const from = url.searchParams.get("from");
    const { version } = Proxy.getEnvs();

    if (!from || version === "development")
      return Response.json({ data: [] }, { status: 200 });

    const rawChangelog = await fetch(
      "https://raw.githubusercontent.com/openhotel/openhotel/master/CHANGELOG.md",
    ).then((response) => response.text());

    const changelog = parseChangelog(rawChangelog);
    const changes = getChangesBetweenVersions(changelog, from, version);

    return Response.json({ data: changes }, { status: 200 });
  },
};
