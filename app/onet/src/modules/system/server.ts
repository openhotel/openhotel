import { getServerSocket } from "@da/socket";

export const server = () => {
  let $server;
  const load = (
    port: number,
    onRequest: (
      $request: Request,
      connInfo: Deno.ServeHandlerInfo,
    ) => Promise<Response> | Response,
  ) => {
    $server = getServerSocket(port, onRequest);
    console.log(`Started on :${port}`);
  };

  return {
    load,
  };
};
