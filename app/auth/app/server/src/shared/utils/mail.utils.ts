export const getHiddenMail = (mail: string) =>
  `${mail.substring(0, 3)}***${mail.substring(mail.length - 3)}`;
