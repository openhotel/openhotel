export const stopCommand = {
  command: "stop",
  func: () => {
    Deno.exit();
  },
};
