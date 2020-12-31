import {Point} from "../point/point";
import {DirectionEnum} from "./direction.enum";

export class DirectionNode {

    public readonly point: Point;

    public northNode: Point | null;
    public eastNode: Point | null;
    public southNode: Point | null;
    public westNode: Point | null;


    constructor(
        point: Point,
        northNode: Point | null = null,
        eastNode: Point | null = null,
        southNode: Point | null = null,
        westNode: Point | null = null
    ) {
        this.point = point;

        this.northNode = northNode;
        this.eastNode = eastNode;
        this.southNode = southNode;
        this.westNode = westNode;
    }

    getNeighbors(): Point[] {
        return [this.northNode, this.eastNode, this.southNode, this.westNode]
            .filter(point => point !== null) as Point[]
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
        }
    }
}
