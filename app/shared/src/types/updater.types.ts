import { ReleaseProject } from "@shared/types/releases.types.ts";

export type UpdatedModule = () => {
  load: (data: { log: typeof console.log; project: ReleaseProject }) => boolean;
  update: (data: {
    version: string;
    target: string;
    preReleases?: boolean;
    stopOnUpdate?: boolean;
  }) => Promise<boolean>;
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
