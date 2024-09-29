import { useAccount } from "./useAccount";

export const useAdmin = () => {
  const { getHeaders } = useAccount();

  const getList = async () =>
    await fetch(`/api/v2/admin`, {
      headers: getHeaders(),
      method: "GET",
    }).then((response) => response.json());

  const add = async (email: string) =>
    await fetch(`/api/v2/admin`, {
      headers: getHeaders(),
      method: "POST",
      body: JSON.stringify({ email }),
    }).then((response) => response.json());

  const remove = async (email: string) =>
    await fetch(`/api/v2/admin`, {
      headers: getHeaders(),
      method: "DELETE",
      body: JSON.stringify({ email }),
    }).then((response) => response.json());

  return {
    getList,
    add,
    remove,
  };
};
