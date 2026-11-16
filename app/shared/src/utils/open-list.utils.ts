import { CompFn, ListNode } from "@shared/types/openList.types.ts";
import { OpenList } from "@shared/types/open-list.types.ts";

export const createOpenList = <T>(comparator: CompFn<T>): OpenList<T> => {
  let start: ListNode<T> | null = null;
  let size = 0;

  const push = (value: T) => {
    if (start === null) {
      start = { value, next: null };
      size++;
      return;
    }

    if (comparator(value, start.value) < 0) {
      start = { value, next: start };
      size++;
      return;
    }

    let aux: ListNode<T> = start;
    while (aux.next !== null && comparator(value, aux.next.value) > 0) {
      aux = aux.next;
    }

    aux.next = { value, next: aux.next };
    size++;
  };

  const pop = (): T => {
    if (start === null) throw new Error("popping from an empty list");
    const popped = start;
    start = popped.next;
    size--;
    return popped.value;
  };

  const length = (): number => size;

  const isEmpty = (): boolean => start === null;

  const toString = (): string => {
    let aux: ListNode<T> | null = start;
    let str = "";
    while (aux !== null) {
      str += aux.value + " -> ";
      aux = aux.next;
    }
    return str;
  };

  return {
    push,
    pop,
    length,
    isEmpty,
    toString,
  };
};
