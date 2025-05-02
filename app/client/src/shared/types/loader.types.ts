export type LoaderItem = {
  label: string;
  items: string[];
  func: (props: unknown) => Promise<unknown>;
};
