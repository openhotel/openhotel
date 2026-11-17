import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { appendCORSHeaders, getCORSHeaders } from "@shared/utils/cors.utils.ts";

const corsHeaders = [
  ["Access-Control-Allow-Origin", "*"],
  ["Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE"],
  [
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  ],
  ["Access-Control-Allow-Credentials", "true"],
];

const toObject = (headers: Headers) => Object.fromEntries(headers.entries());

describe("utils", () => {
  describe("cors", () => {
    const headers = new Headers();
    for (const [key, value] of corsHeaders) headers.append(key, value);

    describe("getCORSHeaders", () => {
      it("returns headers with CORS solved", () => {
        expect(toObject(getCORSHeaders())).toEqual(toObject(headers));
      });
    });

    describe("appendCORSHeaders", () => {
      it("append headers with CORS solved", () => {
        const oldHeaders = new Headers();
        oldHeaders.append("foo", "faa");

        const newHeaders = new Headers();
        for (const [key, value] of corsHeaders) newHeaders.append(key, value);
        newHeaders.append("foo", "faa");

        appendCORSHeaders(oldHeaders);

        expect(toObject(oldHeaders)).not.toEqual(toObject(headers));
        expect(toObject(oldHeaders)).toEqual(toObject(newHeaders));
      });
    });
  });
});
