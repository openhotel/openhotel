export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,16}$/;

export const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

export const EMAIL_REGEX = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;

//account expiration without verification (1 day)
export const ACCOUNT_EXPIRE_TIME = 1000 * 60 * 60 * 24;
