export type OpenList<T> = {
  push: (value: T) => void;
  pop: () => T;
  length: () => number;
  isEmpty: () => boolean;
  toString: () => string;
};
