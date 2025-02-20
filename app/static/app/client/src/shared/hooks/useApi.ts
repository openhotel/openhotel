import { Request } from "shared/types";
import { RequestMethod } from "shared/enums";
import { useCallback } from "react";
import { useCookies } from "./useCookies.ts";

export const useApi = () => {
  const { get: getCookie } = useCookies();

  const $fetch = useCallback(
    async ({
      method = RequestMethod.GET,
      pathname,
      body,
      headers = {},
      cache = true,
      formData = false,
    }: Request) => {
      const response = await fetch(`/api${pathname}`, {
        method,
        headers: new Headers({
          ...headers,
          "account-id": getCookie("account-id"),
          "account-token": getCookie("account-token"),
          ...(formData ? {} : { "Content-Type": "application/json" }),
        }),
        body: body ? (formData ? body : JSON.stringify(body)) : undefined,
        credentials: "include",
        cache: cache ? "default" : "no-store",
      }).then(async (data) => {
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

      if (response.status === 403) {
        globalThis.location.reload();
        return;
      }

      if (response.status !== 200) throw response;

      return response;
    },
    [],
  );

  const getVersion = useCallback(async (): Promise<string> => {
    const {
      data: { version },
    } = await $fetch({
      method: RequestMethod.GET,
      pathname: "/version",
    });
    return version;
  }, [$fetch]);

  return {
    fetch: $fetch,
    getVersion,
  };
};
