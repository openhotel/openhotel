// js-cookie.d.ts
declare module "js-cookie" {
  export interface CookieAttributes {
    /** Days until expiry, or an absolute Date. Omit for a session cookie. */
    expires?: number | Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: "strict" | "Strict" | "lax" | "Lax" | "none" | "None";
    /** Any other attribute is written to the cookie as-is. */
    [property: string]: any;
  }

  export interface CookieConverter {
    read(value: string, name: string): string;
    write(value: string, name: string): string;
  }

  export interface CookiesStatic {
    /** Create or update a cookie. */
    set(
      name: string,
      value: string | boolean | number | object | any[],
      attributes?: CookieAttributes,
    ): string | undefined;

    /** Read all visible cookies. */
    get(): { [key: string]: string };
    /** Read one cookie, or undefined if it doesn't exist. */
    get(name: string): string | undefined;

    /** Delete a cookie. path/domain must match the ones used when it was set. */
    remove(name: string, attributes?: CookieAttributes): void;

    /** New instance with default attributes applied to every set/remove. */
    withAttributes(attributes: CookieAttributes): CookiesStatic;

    /** New instance with custom read/write converters. */
    withConverter(converter: Partial<CookieConverter>): CookiesStatic;

    readonly attributes: CookieAttributes;
    readonly converter: CookieConverter;
  }

  const Cookies: CookiesStatic;
  export default Cookies;
}
