import { parse } from "yaml";
import { Contributor } from "shared/types";
import { OWNER_LIST } from "shared/consts";

export const contributors = () => {
  let contributors: Contributor[] = [];

  const load = async () => {
    const data = await fetch("/contributors.yml");
    contributors = parse(await data.text())
      .map((contributor) => ({
        ...contributor,
        creator: OWNER_LIST.includes(contributor.login),
      }))
      .sort((contributorA: Contributor, contributorB: Contributor) =>
        contributorA.contributions > contributorB.contributions ||
        contributorA.creator
          ? -1
          : 1,
      );
  };

  const getContributors = () => contributors;
  const getCreators = () =>
    contributors.filter((contributor) => contributor.creator);

  return {
    load,

    getContributors,
    getCreators,
  };
};
