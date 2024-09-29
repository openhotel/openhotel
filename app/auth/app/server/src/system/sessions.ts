import { System } from "system/main.ts";
import { TickerQueue } from "@oh/queue";
import { getServerSessionList } from "shared/utils/main.ts";

export const sessions = () => {
  const sessionMap: Record<string, any> = {};

  const $checkSessions = async () => {
    const sessionList = await getServerSessionList();
    console.log(`Checking sessions... (${sessionList.length})`);

    //check disconnected accounts
    for (const accountId of Object.keys(sessionMap)) {
      const foundSession = sessionList.find(({ key }) => key[1] === accountId);

      const session = sessionMap[accountId];
      const $disconnectFromLastServer = () => {
        console.log("disconnect", session.server, accountId);
        fetch(`${session.server}/api/user-disconnected`, {
          method: "POST",
          body: JSON.stringify({ accountId }),
        }).catch(() => {
          //we don't really care if server receives our petition, the session is being invalidated anyway
        });
      };

      if (foundSession) {
        const { sessionId, ticketId, server } = foundSession.value;
        //check if session/server/ticket is still the same
        if (
          session.sessionId !== sessionId ||
          session.ticketId !== ticketId ||
          session.server !== server
        )
          $disconnectFromLastServer();
        continue;
      }
      //account is disconnected
      $disconnectFromLastServer();

      delete sessionMap[accountId];
    }

    //update sessions
    for (const {
      key: [, accountId],
      value: session,
    } of sessionList) {
      sessionMap[accountId] = session;
      console.log(
        `- ${accountId} ${session.ip} ${session.server} ${session.serverIp}`,
      );
    }
  };

  const load = () => {
    System.tasks.add({
      type: TickerQueue.REPEAT,
      repeatEvery: System.getConfig().sessions.checkInterval * 1000,
      onFunc: $checkSessions,
    });
    $checkSessions();
  };

  return {
    load,
  };
};
