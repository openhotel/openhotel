export type LoaderItem = {
  startLabel: string;
  endLabel: string;

  prefix?: string;
  suffix?: string;
  items: string[];

  func: (props: unknown) => Promise<unknown>;
};
