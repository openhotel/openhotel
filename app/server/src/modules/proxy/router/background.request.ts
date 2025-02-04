export const getBackgroundRequest = {
  method: "GET",
  pathname: "/background",
  fn: async (request: Request): Promise<Response> => {
    let background;
    try {
      background = await Deno.readFile("./background.png");
    } catch (e) {}
    if (!background) return Response.error();

    return new Response(background);
  },
};
