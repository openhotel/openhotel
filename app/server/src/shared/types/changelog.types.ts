export interface VersionContent {
  version: string;
  date: string;
  sections: {
    [section: string]: string[];
  };
}
