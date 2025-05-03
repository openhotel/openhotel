import { useContext } from "react";
import { ChangelogContext, ChangelogState } from "./changelog.context";

export const useChangelog = (): ChangelogState => useContext(ChangelogContext);
