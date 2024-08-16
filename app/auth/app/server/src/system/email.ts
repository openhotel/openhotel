import { SmtpClient } from "smtp";
import { System } from "./main.ts";

export const email = () => {
  const $connect = async () => {
    const client = new SmtpClient();
    const {
      email: { hostname, port, username, password },
    } = System.getConfig();
    await client.connect({
      hostname,
      port,
      username,
      password,
    });
    return client;
  };

  const send = async (
    to: string,
    subject: string,
    content: string,
    html: string,
  ) =>
    new Promise<void>((resolve) => {
      const $send = async () => {
        const hiddenEmail = `${to.substring(0, 3)}***${to.substring(to.length - 3, to.length)}`;
        try {
          const client = await $connect();
          const {
            email: { username },
          } = System.getConfig();
          await client.send({
            from: username,
            to,
            subject,
            content,
            html,
          });
          await client.close();
          resolve();
          console.log(`Email sent to ${hiddenEmail}!`);
        } catch (e) {
          console.error(`Email error to ${hiddenEmail}!`);
          setTimeout($send, 5_000);
        }
      };
      $send();
    });

  return {
    send,
  };
};
