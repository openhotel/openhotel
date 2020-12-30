import {Point} from "./point/point";

// Based on A* Node
export class Node {

    public readonly point: Point;
    public cost: number;

    public distanceFromStart: number;
    public totalCost: number
    public heuristicDistance: number = 0;

    public opened: boolean;
    public closed: boolean;

    public parent: Node;

    constructor(point: Point, cost?: number) {
        this.point = point;
        this.cost = cost;

        this.distanceFromStart = 0;
        this.totalCost = 0;
    }
}
