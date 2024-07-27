export const stopCommand = {
  command: "stop",
  func: () => {
    //@ts-ignore
    Deno.exit();
  },
};
