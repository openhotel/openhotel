import {Node} from "./nodes/node";
import {Point} from "./point/point";
import {findPath as findPathJPS} from "../finders/jumpPoint.finder";
import {findPath as findPathJPS_2} from "../finders/jumpPoint_2.finder";
import {PointInterface} from "./point/point.interface";
import {FinderEnum} from "../finders/finder.enum";
import {DirectionNode} from "./nodes/directionNode";

export class Grid {

    private readonly _matrix: number[][];
    private readonly _nodeType: 'node' | 'directionNode';

    public nodes: Node[][] | (DirectionNode | null)[][];

    constructor(
        matrix: number[][],
        nodeType: 'node' | 'directionNode' = 'directionNode'
    ) {
        this._matrix = matrix;
        this._nodeType = nodeType;

        if(this._matrix[0] === undefined || this._matrix[0][0] === undefined)
            throw new Error('grid matrix cannot be empty');

        this.nodes = [];
    }

    private buildNodes(maxJumpCost: number) {
        switch (this._nodeType) {
            case "node":
                this.nodes = this._matrix.map((arrY, y) =>
                    arrY.map((cost, x) =>
                        new Node(new Point(x, y), cost)));
                return;
            case "directionNode":
                this.nodes = this._matrix.map((arrY, y) =>
                    arrY.map((cost, x) => {
                        if (cost === null) return null

                        const directionNode = new DirectionNode(new Point(x, y));

                        const assignDirectionNodeIf = (comparison: boolean, point: Point) => {
                            if (!comparison) return null;
                            const nodePoint = directionNode.point.copy(point.x, point.y);
                            const neighborCost = this.getMatrixCost(nodePoint);

                            return (neighborCost !== null && Math.abs(neighborCost - cost) <= maxJumpCost)
                                ? nodePoint : null;
                        }

                        directionNode.northNode = assignDirectionNodeIf(
                            y - 1 >= 0 && y - 1 < this.height,
                            new Point(0, -1)
                        );
                        directionNode.southNode = assignDirectionNodeIf(
                            y + 1 >= 0 && y + 1 < this.height,
                            new Point(0, 1)
                        );
                        directionNode.westNode = assignDirectionNodeIf(
                            x - 1 >= 0 && x - 1 < this.width,
                            new Point(-1, 0)
                        );
                        directionNode.eastNode = assignDirectionNodeIf(
                            x + 1 >= 0 && x + 1 < this.width,
                            new Point(1, 0)
                        );

                        return directionNode
                    }));
                return;
        }
    }

    public getNode(point: Point): Node | DirectionNode | null {
        if(this.nodes[point.y] === undefined)
            return null;
        return this.nodes[point.y][point.x];
    }

    public getMatrixCost(point: Point): number | null {
        if(this._matrix[point.y] === undefined)
            return null;
        return this._matrix[point.y][point.x];
    }

    private clone(): Grid {
        return new Grid(this._matrix, this._nodeType)
    }

    get width() {
        return this._matrix[0].length;
    }

    get height() {
        return this._matrix.length;
    }

    public findPath(
        startPoint: PointInterface,
        endPoint: PointInterface,
        maxJumpCost: number = 5,
        finderEnum: FinderEnum = FinderEnum.JUMP_POINT_2
    ): PointInterface[] {
        const gridClone = this.clone();
        gridClone.buildNodes(maxJumpCost)

        switch (finderEnum) {
            case FinderEnum.JUMP_POINT:
                return findPathJPS(
                    new Point(startPoint.x, startPoint.y),
                    new Point(endPoint.x, endPoint.y),
                    maxJumpCost,
                    gridClone
                );
            case FinderEnum.JUMP_POINT_2:
                return findPathJPS_2(
                    new Point(startPoint.x, startPoint.y),
                    new Point(endPoint.x, endPoint.y),
                    gridClone
                );
        }
    }

}
