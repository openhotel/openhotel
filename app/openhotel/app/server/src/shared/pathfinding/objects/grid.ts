import {Node} from "./node";
import {Point} from "./point/point";
import {findPath} from "../finders/jumpPoint.finder";
import {PointInterface} from "./point/point.interface";
import {FinderEnum} from "../finders/finder.enum";

export class Grid {

    private _width: number;
    private _height: number;

    private _matrix: number[][];

    public nodes: Node[][];

    constructor(matrix) {
        this._matrix = matrix;

        this._height = matrix.length;
        this._width = matrix[0].length;

        this.nodes = this._matrix.map((arrY, y) =>
            arrY.map((cost, x) =>
                new Node(new Point(x, y), cost)));
    }

    public getNode(point: Point): Node | null {
        const yNodes = this.nodes[point.y];
        return yNodes ? yNodes[point.x] : null;
    }

    private clone(): Grid {
        return new Grid(this._matrix)
    }

    public findPath(
        startPoint: PointInterface,
        endPoint: PointInterface,
        maxJumpCost: number = 5,
        finderEnum: FinderEnum = FinderEnum.JUMP_POINT
    ): PointInterface[] {
        switch (finderEnum) {
            case FinderEnum.JUMP_POINT:
                return findPath(
                    new Point(startPoint.x, startPoint.y),
                    new Point(endPoint.x, endPoint.y),
                    maxJumpCost,
                    this.clone()
                );
        }
    }

}
