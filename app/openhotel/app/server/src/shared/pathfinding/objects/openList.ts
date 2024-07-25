import { CompFn, ListNode } from "./openList.types.ts";

export class OpenList<T> {
  private start: ListNode<T> | null;
  private readonly comparator: CompFn<T>;

  constructor(comparator: CompFn<T>) {
    this.start = null;
    this.comparator = comparator;
  }

  push(value: T) {
    if (this.start === null) {
      this.start = { value, next: null };
      return;
    }

    if (this.comparator(value, this.start.value) < 0) {
      this.start = { value, next: this.start };
      return;
    }

    let aux: ListNode<T> = this.start;
    while (aux.next !== null && this.comparator(value, aux.next.value) > 0) {
      aux = aux.next;
    }

    aux.next = { value, next: aux.next };
  }

  pop(): T {
    if (this.start === null) throw new Error("popping from an empty list");
    const popped = this.start;
    this.start = popped.next;
    return popped.value;
  }

  empty(): boolean {
    return this.start === null;
  }
}
