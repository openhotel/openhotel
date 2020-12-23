import {Point} from "./point/point";

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
}
