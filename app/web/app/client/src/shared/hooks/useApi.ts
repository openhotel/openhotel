import { RequestMethod } from "@oh/components";

export const useApi = () => {
  const $fetch = async <Data extends any>(
    method: RequestMethod,
    pathname: string,
    data?: unknown,
  ): Promise<Data> => {
    const headers = new Headers();

    const { status, data: responseData } = await fetch(`/api/v1${pathname}`, {
      method,
      body: data ? JSON.stringify(data) : null,
      headers,
    }).then((response) => response.json());

    if (status !== 200) throw Error(`Status ${status}!`);

    return responseData as Data;
  };

  return {
    fetch: $fetch,
  };
};
