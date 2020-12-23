import {Node} from "./node";
import {Point} from "./point";
import {Finder} from "./finder";

export class Grid {

    private _width: number;
    private _height: number;

    private _matrix: number[][];

    public nodes: Node[][];

    constructor(matrix) {
        this._matrix = matrix;

        this._height = matrix.length;
        this._width = matrix[0].length;
        this.buildNodes();
    }

    public buildNodes() {
        this.nodes = this._matrix.map((arrY, y) =>
            arrY.map((cost, x) =>
                new Node(new Point(x, y), cost)));
    }

    public getNode(point: Point): Node | null {
        const yNodes = this.nodes[point.y];
        return yNodes ? yNodes[point.x] : null;
    }

    public findPath(
        startPoint: Point,
        endPoint: Point
    ) {
        this.buildNodes();
        return new Finder(this).findPath(startPoint, endPoint);
    }

}
