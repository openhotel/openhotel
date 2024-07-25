import { Point } from "../point/point.ts";

// Based on A* Node
export class Node {
  public readonly point: Point;
  public cost: number;

  public distanceFromStart: number; //g
  public heuristicDistance: number; //h
  public totalCost: number; //f

  public opened: boolean;
  public closed: boolean;

  public parent: Node | undefined;

  constructor(point: Point, cost: number) {
    this.point = point;
    this.cost = cost;

    this.opened = false;
    this.closed = false;

    this.distanceFromStart = 0;
    this.heuristicDistance = 0;
    this.totalCost = 0;
  }
}
