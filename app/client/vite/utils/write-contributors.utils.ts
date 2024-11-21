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
  return await fetch(
    "https://api.github.com/repos/openhotel/openhotel/contributors",
    {
      method: "GET",
    },
  )
    .then((response) => response.json())
    .then((response) => {
      return response.map((contributor: Contributor) => ({
        login: contributor.login,
        html_url: contributor.html_url,
        avatar_url: contributor.avatar_url,
        type: contributor.type,
        contributions: contributor.contributions,
      }));
    });
}

export const writeContributors = async (path: string) => {
  const contributors: Contributor[] = await fetchContributors();
  const humanContributors = contributors.filter((c) => c.type !== "Bot");

  try {
    await writeFile(path, stringify(humanContributors), "utf8");
  } catch (error) {
    console.error("Error writing file:", error);
  }
}
