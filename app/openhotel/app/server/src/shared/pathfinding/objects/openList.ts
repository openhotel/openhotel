import {CompFn, ListNode} from "./openList.types";

export class OpenList<T> {

    private start: ListNode<T> | null;
    private end: ListNode<T> | null;

    private readonly comparator: CompFn<T>;

    constructor(comparator: CompFn<T>) {
        this.start = null;
        this.end = null;
        this.comparator = comparator;
    }

    push(value: T) {
        if (this.start === null) {
            // List is empty
            this.start = {
                value,
                prev: null,
                next: null
            };
            this.end = this.start;
            return;
        }

        // Find the position to insert into
        let aux: ListNode<T> | null = this.start;
        while (aux !== null && this.comparator(aux.value, value) > 0) {
            aux = aux.next;
        }

        if (aux === null) {
            // Inserting at the end
            const newNode = {
                value,
                prev:
                this.end,
                next: null
            };
            if(this.end)
                this.end.next = newNode;
            this.end = newNode;
            return;
        }

        const left = aux.prev;
        const right = aux;

        const newNode: ListNode<T> = {value, prev: left, next: right};

        right.prev = newNode;
        if (left === null) {
            // This means aux is the first node (this.start)
            this.start = newNode;
        } else {
            left.next = newNode;
        }
    }

    pop(): T | null {
        if (this.empty())
            throw ReferenceError("popping from an empty list");

        const popped = this.end;
        this.end = popped?.prev as (ListNode<T> | null);
        if (this.end === null) {
            this.start = null;
        } else {
            this.end.next = null;
        }
        return popped?.value || null;
    }

    empty(): boolean {
        return this.start === null;
    }

}
