import {Point} from "./point";

export class Node {

    public readonly point: Point;
    public cost: number;

    public g: number;
    public h: number;
    public f: number

    public opened: boolean;
    public closed: boolean;

    public parent: Node;

    constructor(point: Point, cost?: number) {
        this.point = point;
        this.cost = cost;

        this.g = 0;
        this.f = 0;
    }

    copy(): Node {
        const node = new Node(this.point, this.cost);;
        node.g = this.g;
        node.f = this.f;
        node.opened = this.opened;
        node.closed = this.closed;
        node.parent = this.parent;
        return node;
    }
}
