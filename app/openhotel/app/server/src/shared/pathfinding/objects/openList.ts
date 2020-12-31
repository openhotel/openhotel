import {CompFn, ListNode} from "./openList.types";

export class OpenList<T> {

    private start: ListNode<T> | null;

    private readonly comparator: CompFn<T>;

    constructor(comparator: CompFn<T>) {
        this.start = null;
        this.comparator = comparator;
    }

    push(value: T) {
        if (this.start === null) {
            // List is empty
            this.start = {
                value,
                next: null
            };
            return;
        }
 
        if (this.comparator(value, this.start.value) < 0) {
            // Inserting at the beginning
            this.start = {
                value,
                next: this.start
            }
            return
        }

        // Find the position to insert into
        let aux: ListNode<T> = this.start;
        while (aux.next !== null && this.comparator(value, aux.next.value) > 0) {
            aux = aux.next;
        }

        const newNode: ListNode<T> = {
            value,
            next: aux.next
        };

        aux.next = newNode;

    }

    pop(): T {
        if (this.start === null)
            throw new Error("popping from an empty list");
        const popped = this.start;
        this.start = popped.next;
        return popped.value;
    }

    empty(): boolean {
        return this.start === null;
    }

}
