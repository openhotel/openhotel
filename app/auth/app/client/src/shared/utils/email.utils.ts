export const getCensoredEmail = (email: string): string =>
  email.substring(0, 1) +
  "**@**.**" +
  email.substring(email.length - 1, email.length);
