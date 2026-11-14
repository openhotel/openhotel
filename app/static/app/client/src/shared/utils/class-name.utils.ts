export const cn = (
  ...args: Array<
    string | { [key: string]: boolean | undefined } | undefined | null
  >
): string =>
  args
    .reduce((acc, arg: any) => {
      if (arg === undefined) return acc;
      if (typeof arg === "string") return [...acc, arg];

      const classes = Object.keys(arg).reduce((j, key) => {
        if (arg[key]) return [...j, key];
        return j;
      }, [] as string[]);

      return [...acc, ...classes];
    }, [] as string[])
    .join(" ");
