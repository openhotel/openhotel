import { expect, describe, it } from "@jest/globals";
import { appendCORSHeaders, getCORSHeaders } from "../cors.utils.ts";

const corsHeaders = [
  ["Access-Control-Allow-Origin", "*"],
  ["Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE"],
  [
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  ],
  ["Access-Control-Allow-Credentials", "true"],
];

describe("utils", () => {
  describe("cors", () => {
    const headers = new Headers();
    for (const [key, value] of corsHeaders) headers.append(key, value);

    describe("getCORSHeaders", () => {
      it("returns headers with CORS solved", () => {
        console.log(getCORSHeaders());
        expect(getCORSHeaders()).toEqual(headers);
      });
    });
    describe("appendCORSHeaders", () => {
      const oldHeaders = new Headers();
      oldHeaders.append("foo", "faa");

      const newHeaders = new Headers();
      for (const [key, value] of corsHeaders) newHeaders.append(key, value);
      newHeaders.append("foo", "faa");

      it("append headers with CORS solved", () => {
        appendCORSHeaders(oldHeaders);
        const oldHeadersObject = Object.fromEntries(oldHeaders.entries());
        const newHeadersObject = Object.fromEntries(newHeaders.entries());
        const headersObject = Object.fromEntries(headers.entries());

        expect(oldHeadersObject).not.toEqual(headersObject);

        expect(oldHeadersObject).toEqual(newHeadersObject);
      });
    });
  });
});
