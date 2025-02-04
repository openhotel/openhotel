export const getIconRequest = {
  method: "GET",
  pathname: "/icon",
  fn: async (request: Request): Promise<Response> => {
    let icon;
    try {
      icon = await Deno.readFile("./icon.png");
    } catch (e) {}
    if (!icon) return Response.error();

    return new Response(icon);
  },
};
