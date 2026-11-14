import type { Size2d } from "./size.types.ts";
import type { RequestType } from "./request.types.ts";

export interface GameManifest {
  id: string;
  name: string;
  description?: string;
  type: "fullscreen" | "window";
  version: string;
  icon?: string;
  author?: string;
  clientUrl: string;
  serverUrl?: string;
}

export interface GameModule {
  id: string;
  version: string;
  name: string;
  start: (params: GameStartParams) => unknown; // React.JSX.Element;
  destroy?: () => void;
  metadata?: GameMetadata;
}

export interface GameStartParams {
  data: Record<string, unknown>; // TODO: to be defined data from hotel, like context, users, ...
  onEnd: () => void;
}

export interface GameMetadata {
  type?: "fullscreen" | "window";
  size?: Size2d;
  // TODO: to be defined
}

export interface GameServerModule {
  getApi?: (context: RegisterContext) => RequestType[];
  getSocketEvents?: (context: RegisterContext) => ProxyEventType[];
}

type ProxyEventType<Data extends unknown = undefined> = {
  event: string;
  func: (data: ProxyFuncProps<Data>) => Promise<unknown> | unknown;
};
type ProxyFuncProps<Data> = {
  data?: Data;
  user?: unknown; // TODO: limit UserMutable options
};

export interface RegisterContext {
  basePath?: string;
  // TODO: to be defined data exposed to the game
}
