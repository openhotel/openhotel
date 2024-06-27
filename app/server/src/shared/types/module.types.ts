import { Module } from "shared/enums/main.ts";

export type ModuleProps = {
  module: Module;
  internal: {
    token: string;
    serverPort: number;
    firewallPort: number;
    proxyPort: number;
  };
  port: number;
};
