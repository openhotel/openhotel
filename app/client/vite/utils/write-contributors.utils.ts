import { stringify } from "yaml";
import { writeFile } from "fs/promises";

interface Contributor {
  login: string;
  html_url: string;
  avatar_url: string;
  type: string;
  contributions: number;
}

export const fetchContributors = async () => {
  const repos = await fetch("https://api.github.com/orgs/openhotel/repos").then(
    (response) => response.json(),
  );

  const contributors: Contributor[] = [];

  for (const { name: repoName } of repos) {
    const $contributors = await fetch(
      `https://api.github.com/repos/openhotel/${repoName}/contributors`,
    ).then((response) => response.json());

    for (const $contributor of $contributors) {
      const foundContributor = contributors.find(
        (contributor) => contributor.login === $contributor.login,
      );

      if (foundContributor) {
        foundContributor.contributions += $contributor.contributions;
        continue;
      }

      contributors.push({
        login: $contributor.login,
        html_url: $contributor.html_url,
        avatar_url: $contributor.avatar_url,
        type: $contributor.type,
        contributions: $contributor.contributions,
      } as Contributor);
    }
  }

  return contributors.sort((conA, conB) =>
    conA.contributions > conB.contributions ? -1 : 1,
  );
};

export const writeContributors = async (path: string) => {
  const contributors: Contributor[] = await fetchContributors();
  const humanContributors = contributors.filter((c) => c.type !== "Bot");

  try {
    await writeFile(path, stringify(humanContributors), "utf8");
  } catch (error) {
    console.error("Error writing file:", error);
  }
};
