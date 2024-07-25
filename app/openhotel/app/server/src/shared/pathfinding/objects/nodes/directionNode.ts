import { Point } from "../point/point.ts";
import { DirectionEnum } from "./direction.enum.ts";

export class DirectionNode {
  public readonly point: Point;
  public northNode: Point | null;
  public eastNode: Point | null;
  public southNode: Point | null;
  public westNode: Point | null;
  public northWestNode: Point | null;
  public northEastNode: Point | null;
  public southWestNode: Point | null;
  public southEastNode: Point | null;

  constructor(
    point: Point,
    northNode: Point | null = null,
    eastNode: Point | null = null,
    southNode: Point | null = null,
    westNode: Point | null = null,
    northWestNode: Point | null = null,
    northEastNode: Point | null = null,
    southWestNode: Point | null = null,
    southEastNode: Point | null = null,
  ) {
    this.point = point;
    this.northNode = northNode;
    this.eastNode = eastNode;
    this.southNode = southNode;
    this.westNode = westNode;
    this.northWestNode = northWestNode;
    this.northEastNode = northEastNode;
    this.southWestNode = southWestNode;
    this.southEastNode = southEastNode;
  }

  getNeighbor(direction: DirectionEnum): Point | null {
    switch (direction) {
      case DirectionEnum.NORTH:
        return this.northNode;
      case DirectionEnum.EAST:
        return this.eastNode;
      case DirectionEnum.SOUTH:
        return this.southNode;
      case DirectionEnum.WEST:
        return this.westNode;
      case DirectionEnum.NORTH_WEST:
        return this.northWestNode;
      case DirectionEnum.NORTH_EAST:
        return this.northEastNode;
      case DirectionEnum.SOUTH_WEST:
        return this.southWestNode;
      case DirectionEnum.SOUTH_EAST:
        return this.southEastNode;
    }
  }
}
