import { System } from "system/main.ts";
import { TickerQueue } from "@oh/queue";
import { getServerSessionList } from "shared/utils/main.ts";

export const sessions = () => {
  const sessionMap: Record<string, any> = {};

  const $disconnectFromLastServer = (accountId: string, server: string) => {
    const headers = new Headers();
    headers.append("auth-server", performance.now() + "");

    console.error(`${server}/auth/user-disconnected?accountId=${accountId}`);
    fetch(`${server}/auth/user-disconnected?accountId=${accountId}`, {
      headers,
    })
      .then(async (response) => console.error(await response.json()))
      .catch((e) => {
        console.error(e);
        //we don't really care if server receives our petition, the session is being invalidated anyway
      });
  };

  const $checkSessions = async () => {
    const currentSessions = Object.keys(sessionMap);
    const targetSessions = (await getServerSessionList()).map<string>(
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
      $disconnectFromLastServer(accountId, sessionMap[accountId].server);
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
    const foundSession = await System.db.get([
      "serverSessionByAccount",
      accountId,
    ]);
    const session = sessionMap[accountId];

    const currentSession = foundSession.value;

    //check if session server exists and changed if so disconnect from last server
    //only if last server is different from current one
    if (
      session &&
      session.server !== currentSession?.server &&
      (session.sessionId !== currentSession?.sessionId ||
        session.ticketId !== currentSession?.ticketId)
    ) {
      $disconnectFromLastServer(accountId, session.server);
      console.warn(
        accountId,
        "->",
        session?.server,
        "->",
        foundSession?.value?.server,
        "<<<<",
      );
    }
    //reassign server session
    sessionMap[accountId] = currentSession;
  };

  return {
    load,
    checkAccountSession,
  };
};
