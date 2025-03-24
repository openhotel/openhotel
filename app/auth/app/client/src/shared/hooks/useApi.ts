import { Request } from "shared/types";
import { RequestMethod } from "../enums";
import { useCallback } from "react";
import { useFingerprint } from "./useFingerprint";

export const useApi = () => {
  const { fingerprint } = useFingerprint();

  const $fetch = useCallback(
    async ({
      method = RequestMethod.GET,
      pathname,
      body,
      headers = {},
      cache = true,
      rawResponse = false,
      preventReload = false,
    }: Request) => {
      const response = await fetch(`/api/v3${pathname}`, {
        method,
        headers: new Headers({
          "Content-Type": "application/json",
          fingerprint,
          ...headers,
        }),
        body: body ? JSON.stringify(body) : undefined,
        credentials: "include",
        cache: cache ? "default" : "no-store",
      }).then(async (data) => {
        if (rawResponse) return data;

        const contentType = data.headers.get("content-type");

        // Check that the response is JSON before calling `.json()`,
        // otherwise there is no way to recover the response_text in case of an error
        if (contentType && contentType.indexOf("application/json") !== -1) {
          try {
            return await data.json();
          } catch (e) {
            throw {
              status: data.status,
              message: data.statusText,
              response_text: null,
            };
          }
        }
        // If the response is not JSON, throw an error
        const response_text = await data.text();
        throw {
          status: data.status,
          message: response_text.length
            ? `${data.status}: Invalid JSON response`
            : `${data.status}: Empty response`,
          response_text,
        };
      });

      if (rawResponse) return response;

      if (!preventReload && response.status === 403) {
        globalThis.location.reload();
        return;
      }

      if (response.status !== 200) throw response;

      return response;
    },
    [fingerprint],
  );

  const getVersion = useCallback(async (): Promise<string> => {
    const {
      data: { version },
    } = await $fetch({
      method: RequestMethod.GET,
      pathname: "/_/version",
    });
    return version;
  }, [$fetch]);

  return {
    fetch: $fetch,
    getVersion,
  };
};
