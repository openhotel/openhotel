export type CompFn<T> = (a: T, b: T) => number;

export type ListNode<T> = {
  value: T;
  next: ListNode<T> | null;
};
