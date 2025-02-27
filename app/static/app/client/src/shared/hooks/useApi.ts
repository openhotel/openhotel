import { Request } from "shared/types";
import { RequestMethod } from "shared/enums";
import { useCallback } from "react";

export const useApi = () => {
  const $fetch = useCallback(
    async ({
      method = RequestMethod.GET,
      pathname,
      body,
      headers = {},
      cache = true,
      rawResponse = false,
      formData = false,
      params,
    }: Request) => {
      let url = `/api/${pathname}`;
      if (method === RequestMethod.GET && params) {
        const query = new URLSearchParams(params).toString();
        url += `?${query}`;
      }

      const response = await fetch(url, {
        method,
        headers: new Headers({
          ...headers,
          credentials: "include",
          ...(formData ? {} : { "Content-Type": "application/json" }),
        }),
        body: body ? (formData ? body : JSON.stringify(body)) : undefined,
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

      if (response.status === 403) {
        // In this web if not is admin redirect to auth
        globalThis.location.replace("https://auth.openhotel.club");
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
