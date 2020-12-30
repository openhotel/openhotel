import {Point} from "./point/point";

// Based on A* Node
export class Node {

    public readonly point: Point;
    public cost: number;

    public distanceFromStart: number;
    public totalCost: number
    public heuristicDistance: number;

    public opened: boolean = false;
    public closed: boolean = false;

    public parent?: Node = undefined;

    constructor(point: Point, cost: number) {
        this.point = point;
        this.cost = cost;

        this.distanceFromStart = 0;
        this.totalCost = 0;
        this.heuristicDistance = 0;
    }
}
