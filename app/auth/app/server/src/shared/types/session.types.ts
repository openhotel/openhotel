export type Session = {
  sessionId: string;
  ticketId: string;
  serverIp: string;
  ip: string;

  serverId?: string;
  serverToken?: string;
  claimed?: boolean;
};
