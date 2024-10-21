import { System } from "./main.ts";
import nodemailer from "nodemailer";

export const email = () => {
  let transporter;
  const $loadTransporter = (currentResolve?: () => void) =>
    new Promise<void>((resolve, reject) => {
      const {
        email: { enabled, hostname, port, username, password },
      } = System.getConfig();

      if (!enabled) return resolve();

      transporter = nodemailer.createTransport({
        host: hostname,
        port,
        secure: true, // use TLS
        auth: {
          user: username,
          pass: password,
        },
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false,
        },
      });
      const targetResolve = currentResolve ?? resolve;
      transporter.verify((error, success) => {
        if (error) {
          console.error("Error loading email transporter!");
          $loadTransporter(targetResolve);
          return;
        }
        console.error("Email transporter loaded!");
        targetResolve();
      });
    });

  const load = async () => {
    await $loadTransporter();
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
          const {
            email: { enabled, username },
          } = System.getConfig();
          if (!enabled) return resolve();

          await new Promise<void>((resolve, reject) => {
            transporter.sendMail(
              {
                from: username,
                to,
                subject: subject,
                text: content,
                html,
              },
              (error, info) => {
                error ? reject() : resolve();
              },
            );
          });
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
    load,
    send,
  };
};
