export type ModuleProps = {
  internal: {
    token: string;
    serverPort: number;
    firewallPort: number;
    proxyPort: number;
  };
  clientPort: number;
  apiPort: number;
};
