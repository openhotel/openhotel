export type UpdateProps = {
  version: string;
  targetVersion: string;
  repository: string;
  headers?: Record<string, string>;
  log?: (text: string) => void;
  debug?: (text: string) => void;
  label?: string;
};

export type GithubAsset = {
  name: string;
  url: string;
  content_type: string;
};

export type LatestVersionProps = {
  version: string;
  repository: string;
  headers?: Record<string, string>;
  log?: (text: string) => void;
  debug?: (text: string) => void;
};
