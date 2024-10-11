import { System } from "modules/system/main.ts";
import { TickerQueue } from "@oh/queue";
import { getServerSessionList } from "shared/utils/main.ts";
import { Session } from "shared/types/session.types.ts";

export const sessions = () => {
  const sessionMap: Record<string, Session> = {};

  const $disconnectFromLastServer = async (
    accountId: string,
    serverId: string,
  ) => {
    const headers = new Headers();
    headers.append("auth-server", performance.now() + "");

    const server = await System.servers.getServerData(serverId);
    if (!server) return;

    const protocol = `http${System.getEnvs().version === "development" ? "" : "s"}://`;
    fetch(
      `${protocol}${server.hostname}/auth/user-disconnected?accountId=${accountId}`,
      {
        headers,
      },
    )
      .then(async (response) => console.error(await response.json()))
      .catch((e) => {
        console.error(e);
        //we don't really care if server receives our petition, the session is being invalidated anyway
      });
  };

  const $checkSessions = async () => {
    const currentSessions = Object.keys(sessionMap);
    const targetSessions: string[] = (await getServerSessionList()).map(
      ({ key: [, accountId] }) => accountId,
    );
    console.log(
      `Checking sessions... (${currentSessions.length}..${targetSessions.length})`,
    );

    const toDeleteSessions = currentSessions.filter(
      (accountId) => !targetSessions.includes(accountId),
    );

    //remove not active sessions
    for (const accountId of toDeleteSessions) {
      if (!sessionMap[accountId]) return;
      $disconnectFromLastServer(accountId, sessionMap[accountId].serverId);
      delete sessionMap[accountId];
    }

    const accountCheckList = [
      ...new Set([...currentSessions, ...targetSessions]),
    ].filter((accountId) => toDeleteSessions.includes(accountId));

    //check accounts
    for (const accountId of accountCheckList) checkAccountSession(accountId);
  };

  const load = () => {
    System.tasks.add({
      type: TickerQueue.REPEAT,
      repeatEvery: System.getConfig().sessions.checkInterval * 1000,
      onFunc: $checkSessions,
    });
    $checkSessions();
  };

  const checkAccountSession = async (accountId: string) => {
    const currentSession: Session = await System.db.get([
      "serverSessionByAccount",
      accountId,
    ]);
    const session = sessionMap[accountId];

    //check if session server exists and changed if so disconnect from last server
    //only if last server is different from current one
    if (
      session &&
      session.serverId !== currentSession?.serverId &&
      (session.sessionId !== currentSession?.sessionId ||
        session.ticketId !== currentSession?.ticketId)
    ) {
      $disconnectFromLastServer(accountId, session.serverId);
    }

    //reassign server session
    sessionMap[accountId] = currentSession;
  };

  return {
    load,
    checkAccountSession,
  };
};
