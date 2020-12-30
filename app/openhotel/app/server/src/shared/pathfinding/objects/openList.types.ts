
export type CompFn<T> = (a: T, b: T) => number;

export type ListNode<T> = {
    value: T,
    prev: ListNode<T> | null,
    next: ListNode<T> | null
};
