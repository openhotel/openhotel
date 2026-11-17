import { ReleaseProject } from "@shared/types/releases.types.ts";

export type UpdatedModule = () => {
  load: (data: {
    log: typeof console.log;
    project: ReleaseProject;
    enabled: boolean;
  }) => boolean;
  update: (data: {
    version: string;
    target: string;
    preReleases?: boolean;
    stopOnUpdate?: boolean;
  }) => Promise<boolean>;
  getLastVersion: (data: { preReleases: boolean }) => Promise<string | null>;
};

export type GithubAsset = {
  name: string;
  url: string;
  content_type: string;
};

export type GithubResponse = {
  assets: GithubAsset[];
  tag_name: string;
};

/**
 * @deprecated
 */
export type UpdateProps = {
  version: string;
  targetVersion: string;
  repository: string;
  headers?: Record<string, string>;
  log?: (text: string) => void;
  debug?: (text: string) => void;
  label?: string;
};

/**
 * @deprecated
 */
export type LatestVersionProps = {
  version: string;
  repository: string;
  headers?: Record<string, string>;
  log?: (text: string) => void;
  debug?: (text: string) => void;
};
