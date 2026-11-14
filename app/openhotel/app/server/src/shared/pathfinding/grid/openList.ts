import { CompFn, ListNode } from "../types/main.ts";

export class OpenList<T> {
  private start: ListNode<T> | null;
  private size: number;
  private readonly comparator: CompFn<T>;

  constructor(comparator: CompFn<T>) {
    this.start = null;
    this.size = 0;
    this.comparator = comparator;
  }

  push(value: T) {
    if (this.start === null) {
      this.start = { value, next: null };
      this.size++;
      return;
    }

    if (this.comparator(value, this.start.value) < 0) {
      this.start = { value, next: this.start };
      this.size++;
      return;
    }

    let aux: ListNode<T> = this.start;
    while (aux.next !== null && this.comparator(value, aux.next.value) > 0) {
      aux = aux.next;
    }

    aux.next = { value, next: aux.next };
    this.size++;
  }

  pop(): T {
    if (this.start === null) throw new Error("popping from an empty list");
    const popped = this.start;
    this.start = popped.next;
    this.size--;
    return popped.value;
  }

  length(): number {
    return this.size;
  }

  isEmpty(): boolean {
    return this.start === null;
  }

  toString(): string {
    let aux: ListNode<T> | null = this.start;
    let str = "";
    while (aux !== null) {
      str += aux.value + " -> ";
      aux = aux.next;
    }
    return str;
  }
}
