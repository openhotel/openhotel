import {Grid} from "../objects/grid";
import {Point} from "../objects/point/point";
import {OpenList} from "../objects/openList";
import {Node} from "../objects/node";
import {HeuristicUtils} from "../utils/heuristic.utils";
import {PointInterface} from "../objects/point/point.interface";

export const findPath = (
    startPoint: Point,
    endPoint: Point,
    maxJumpCost: number,
    grid: Grid
): PointInterface[] => {

    const openList: OpenList = new OpenList();
    const startNode: Node = grid.getNode(startPoint);
    const endNode: Node = grid.getNode(endPoint);

    startNode.opened = true;
    openList.push(startNode);

    const jump = (neighbor: Node, node: Node): Node | null => {
        if(!neighbor || neighbor.cost === 0)
            return null;

        if(neighbor.point.equal(endNode.point))
            return neighbor;

        const { point: neighborPoint } = neighbor;
        const { point: nodePoint } = node;

        const correctedPoint = new Point(
            neighborPoint.x - nodePoint.x,
            neighborPoint.y - nodePoint.y,
        );

        if(correctedPoint.equal(endNode.point))
            return endNode;

        const getNode = (x: number, y: number) => grid.getNode(neighborPoint.copy(x, y));

        if(correctedPoint.x !== 0 && (
            (getNode(0, -1)?.cost > 0 && getNode(- correctedPoint.x, -1)?.cost === 0)
            || (getNode(0, 1)?.cost > 0 && getNode(- correctedPoint.x, 1)?.cost === 0)
        )) return neighbor;

        else if(correctedPoint.y !== 0) {
            if(
                (getNode(-1, 0)?.cost > 0 && getNode(- 1, - correctedPoint.y)?.cost === 0)
                || (getNode(1, 0)?.cost > 0 && getNode(1, - correctedPoint.y)?.cost === 0)
            ) return neighbor;

            if(jump(getNode(1, 0), neighbor) || jump(getNode(-1, 0), neighbor))
                return neighbor;
        }
        return jump(getNode(correctedPoint.x, correctedPoint.y), neighbor);
    }

    const identifySuccessors = (node: Node) => {
        findNeighbors(node).map(neighbor => {
            const jumpNode = jump(neighbor, node);
            if(!jumpNode) return;

            if(jumpNode.closed) return;

            const { point: nodePoint } = node;
            const { point: jumpNodePoint } = jumpNode;

            const jumpPoint = {
                x: jumpNodePoint.x - nodePoint.x,
                y: jumpNodePoint.y - nodePoint.y
            }
            const absoluteJumpPoint = {
                x: Math.abs(jumpPoint.x),
                y: Math.abs(jumpPoint.y)
            }
            const distance = HeuristicUtils.Octile(absoluteJumpPoint.x, absoluteJumpPoint.y);

            // to expensive to jump
            const currentJumpCost = Math.abs(node.cost - jumpNode.cost);
            const jumpAverageCost = currentJumpCost / distance;
            if(jumpAverageCost > maxJumpCost)
                return;

            const ng = (node.g + distance) * neighbor.cost;

            if(jumpNode.opened && ng >= jumpNode.g) return;

            const { point: endNodePoint } = endNode;

            jumpNode.g = ng;
            jumpNode.h = jumpNode.h || HeuristicUtils.DrManhattan(
                Math.abs(jumpNodePoint.x - endNodePoint.x),
                Math.abs(jumpNodePoint.y - endNodePoint.y)
            );
            jumpNode.f = jumpNode.g + jumpNode.h;
            jumpNode.parent = node;

            if(!jumpNode.opened) {
                jumpNode.opened = true;
                openList.push(jumpNode);
                return;
            }
        });
    }

    const findNeighbors = (node: Node): Node[] => {

        const { parent, point: nodePoint } = node;

        if(!parent) return getNeighbors(node);

        const { point: parentPoint } = parent;

        const getNormalizedNumber = (no: number, pa: number) =>
            (no - pa) / Math.max(Math.abs(no - pa), 1);

        const normalizedPoint = new Point(
            getNormalizedNumber(nodePoint.x, parentPoint.x),
            getNormalizedNumber(nodePoint.y, parentPoint.y)
        );

        const neighbors: Node[] = [];

        if(normalizedPoint.x !== 0) {
            const topNode = grid.getNode(nodePoint.copy(0, - 1));
            if (topNode?.cost > 0) neighbors.push(topNode);

            const bottomNode = grid.getNode(nodePoint.copy(0, + 1));
            if (bottomNode?.cost > 0) neighbors.push(bottomNode);

            const normalizedXNode = grid.getNode(nodePoint.copy(normalizedPoint.x, 0));
            if (normalizedXNode?.cost > 0) neighbors.push(normalizedXNode);

            return neighbors;
        }


        if(normalizedPoint.y !== 0) {
            const leftNode = grid.getNode(nodePoint.copy(-1, 0));
            if (leftNode?.cost > 0) neighbors.push(leftNode);

            const rightNode = grid.getNode(nodePoint.copy(1, 0));
            if (rightNode?.cost > 0) neighbors.push(rightNode);

            const normalizedYNode = grid.getNode(nodePoint.copy(0, normalizedPoint.y));
            if (normalizedYNode?.cost > 0) neighbors.push(normalizedYNode);

            return neighbors;
        }
    }

    const getNeighbors = (node: Node): Node[] => {
        const neighbors: Node[] = [];
        const nodePoint = node.point;

        // ↑
        const topNode = grid.getNode(nodePoint.copy(0, -1));
        if (topNode?.cost > 0) neighbors.push(topNode);
        // →
        const rightNode = grid.getNode(nodePoint.copy(1, 0));
        if (rightNode?.cost > 0) neighbors.push(rightNode);
        // ↓
        const bottomNode = grid.getNode(nodePoint.copy(0, 1));
        if (bottomNode?.cost > 0) neighbors.push(bottomNode);
        // ←
        const leftNode = grid.getNode(nodePoint.copy(-1, 0));
        if (leftNode?.cost > 0) neighbors.push(leftNode);

        return neighbors;
    }

    while (!openList.empty()) {

        const node = openList.pop();
        node.closed = true;

        if (node === endNode) {
            const getParentPoint = (_node: Node, pointList: Point[] = []): Point[] =>
                _node.parent
                    ? getParentPoint(_node.parent, [...pointList, _node.point])
                    : [...pointList, _node.point];
            return getParentPoint(node)
                .reverse()
                .map(point => ({ x: point.x, y: point.y }));
        }

        identifySuccessors(node)
    }
    return [];

}
