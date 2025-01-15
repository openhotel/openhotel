import { Contributor } from "shared/types";

export const OWNER_LIST: string[] = ["pagoru", "alqubo"];

export const CONTRIBUTOR_LOOP_TIME = 3500;

export const DEFAULT_CONTRIBUTOR_LIST: Contributor[] = [
  {
    login: "pagoru",
    contributions: 100,
    creator: true,
  },
  {
    login: "alqubo",
    contributions: 95,
    creator: true,
  },
  {
    login: "development",
    contributions: 10,
  },
] as Contributor[];
