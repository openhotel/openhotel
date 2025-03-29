import { useCallback, useEffect, useRef } from "react";
import { parse } from "yaml";
import { DEFAULT_CONTRIBUTOR_LIST, OWNER_LIST } from "shared/consts";
import { Contributor } from "shared/types";

export const useContributors = () => {
  const contributorsRef = useRef<Contributor[]>([]);

  useEffect(() => {
    fetch("/contributors.yml")
      .then((data) => data.text())
      .then((data) => {
        contributorsRef.current = parse(data)
          .map((contributor) => ({
            ...contributor,
            creator: OWNER_LIST.includes(contributor.login),
          }))
          .sort(
            (contributorA: Contributor, contributorB: Contributor) =>
              Number(contributorB.creator) - Number(contributorA.creator) ||
              contributorB.contributions - contributorA.contributions,
          );
      })
      .catch(() => {
        contributorsRef.current = DEFAULT_CONTRIBUTOR_LIST;
      });
  }, []);

  const getContributors = useCallback(
    () =>
      contributorsRef.current?.length
        ? contributorsRef.current
        : DEFAULT_CONTRIBUTOR_LIST,
    [],
  );
  const getCreators = useCallback(
    () => getContributors().filter((contributor) => contributor.creator),
    [getContributors],
  );

  return {
    getContributors,
    getCreators,
  };
};
