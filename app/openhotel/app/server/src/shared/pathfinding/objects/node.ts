import {Point} from "./point/point";

export class Node {

    public readonly point: Point;
    public cost: number;

    public g: number;
    public f: number
    public h: number = 0;

    public opened: boolean = false;
    public closed: boolean = false;

    public parent?: Node = undefined;

    constructor(point: Point, cost: number) {
        this.point = point;
        this.cost = cost;

        this.g = 0;
        this.f = 0;
    }
}
