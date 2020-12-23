import {Grid} from "./grid";
import {Point} from "./point";
import {OpenList} from "./openList";
import {Node} from "./node";
import {Heuristic} from "./heuristic";

export class Finder {

    private readonly grid: Grid;

    private openList: OpenList;
    private startNode: Node;
    private endNode: Node;

    constructor(grid: Grid) {
        this.grid = grid;
    }

    findPath(
        startPoint: Point,
        endPoint: Point
    ): Point[] {
        this.openList = new OpenList();
        this.startNode = this.grid.getNode(startPoint);
        this.endNode = this.grid.getNode(endPoint);

        this.startNode.opened = true;
        this.openList.push(this.startNode);

        while (!this.openList.empty()) {

            const node = this.openList.pop();
            node.closed = true;

            if (node === this.endNode) {
                const getParentPoint = (_node: Node, pointList: Point[] = []): Point[] =>
                    _node.parent
                        ? getParentPoint(_node.parent, [...pointList, _node.point])
                        : [...pointList, _node.point];
                return getParentPoint(node).reverse();
            }

            this.identifySuccessors(node)
        }
        return [];

    }


    jump(neighbor: Node, node: Node): Node | null {
        if(!neighbor || neighbor.cost === 0)
            return null;

        if(neighbor.point.equal(this.endNode.point))
            return neighbor;

        const { point: neighborPoint } = neighbor;
        const { point: nodePoint } = node;

        const correctedPoint = new Point(
            neighborPoint.x - nodePoint.x,
            neighborPoint.y - nodePoint.y,
        );

        if(correctedPoint.equal(this.endNode.point))
            return this.endNode;

        const getNode = (x: number, y: number) => this.grid.getNode(neighborPoint.copy(x, y));

        if(correctedPoint.x !== 0 && (
            (getNode(0, -1)?.cost > 0 && getNode(- correctedPoint.x, -1)?.cost > 0)
            || (getNode(0, 1)?.cost > 0 && getNode(- correctedPoint.x, 1)?.cost > 0)
        )) return neighbor;

        if(correctedPoint.y !== 0) {
            if(
                (getNode(-1, 0)?.cost > 0 && getNode(- 1, - correctedPoint.y)?.cost > 0)
                || (getNode(1, 0)?.cost > 0 && getNode(1, - correctedPoint.y)?.cost > 0)
            ) return neighbor;

            //When moving vertically, must check for horizontal jump points
            if(this.jump(getNode(1, 0), node) || this.jump(getNode(-1, 0), node))
                return neighbor;
        }
        return this.jump(getNode(correctedPoint.x, correctedPoint.y), node);
    }

    identifySuccessors(node: Node) {
        this.findNeighbors(node).map(neighbor => {
            const jumpNode = this.jump(neighbor, node);
            if(!jumpNode) return;

            if(jumpNode.closed) return;

            const { point: nodePoint } = node;
            const { point: jumpNodePoint } = jumpNode;

            const jumpPoint = {
                x: Math.abs(jumpNodePoint.x - nodePoint.x),
                y: Math.abs(jumpNodePoint.y - nodePoint.y)
            }
            const distance = Heuristic.Octile(jumpPoint.x, jumpPoint.y);

            // console.log(node.point, distance)
            //TODO Calcular {cost} del cada uno de los nodos del salto.
            const ng = node.g + distance + node.cost;

            if(jumpNode.opened && ng >= jumpNode.g + jumpNode.cost) return;

            const { point: endNodePoint } = this.endNode;

            jumpNode.g = ng;
            jumpNode.h = jumpNode.h || Heuristic.DrManhattan(
                Math.abs(jumpNodePoint.x - endNodePoint.x),
                Math.abs(jumpNodePoint.y - endNodePoint.y)
            );
            jumpNode.f = jumpNode.g + jumpNode.h;
            jumpNode.parent = node;

            if(!jumpNode.opened) {
                jumpNode.opened = true;
                this.openList.push(jumpNode);
                return;
            }
        });
    }

    findNeighbors(node: Node): Node[] {
        const neighbors: Node[] = [];

        const { parent, point: nodePoint } = node;

        if(!parent) return this.getNeighbors(node);

        const { point: parentPoint } = parent;

        const getNormalizedNumber = (no: number, pa: number) => (no - pa) / Math.max(Math.abs(no - pa), 1);

        const normalizedPoint = new Point(
            getNormalizedNumber(nodePoint.x, parentPoint.x),
            getNormalizedNumber(nodePoint.y, parentPoint.y)
        );

        if(normalizedPoint.x !== 0) {
            const topNode = this.grid.getNode(nodePoint.copy(0, - 1));
            if (topNode?.cost > 0) neighbors.push(topNode);

            const bottomNode = this.grid.getNode(nodePoint.copy(0, + 1));
            if (bottomNode?.cost > 0) neighbors.push(bottomNode);

            const normalizedXNode = this.grid.getNode(nodePoint.copy(normalizedPoint.x, 0));
            if (normalizedXNode?.cost > 0) neighbors.push(normalizedXNode);

            return neighbors;
        }


        if(normalizedPoint.y !== 0) {
            const leftNode = this.grid.getNode(nodePoint.copy(-1, 0));
            if (leftNode?.cost > 0) neighbors.push(leftNode);

            const rightNode = this.grid.getNode(nodePoint.copy(1, 0));
            if (rightNode?.cost > 0) neighbors.push(rightNode);

            const normalizedYNode = this.grid.getNode(nodePoint.copy(0, normalizedPoint.y));
            if (normalizedYNode?.cost > 0) neighbors.push(normalizedYNode);

            return neighbors;
        }
    }

    getNeighbors(node: Node): Node[] {
        const neighbors: Node[] = [];
        const nodePoint = node.point;

        // ↑
        const topNode = this.grid.getNode(nodePoint.copy(0, -1));
        if (topNode?.cost > 0) neighbors.push(topNode);
        // →
        const rightNode = this.grid.getNode(nodePoint.copy(1, 0));
        if (rightNode?.cost > 0) neighbors.push(rightNode);
        // ↓
        const bottomNode = this.grid.getNode(nodePoint.copy(0, 1));
        if (bottomNode?.cost > 0) neighbors.push(bottomNode);
        // ←
        const leftNode = this.grid.getNode(nodePoint.copy(-1, 0));
        if (leftNode?.cost > 0) neighbors.push(leftNode);

        return neighbors;
    }

}
