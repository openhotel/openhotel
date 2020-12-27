"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPath = void 0;
const point_1 = require("../objects/point/point");
const openList_1 = require("../objects/openList");
const heuristic_utils_1 = require("../utils/heuristic.utils");
const findPath = (startPoint, endPoint, maxJumpCost, grid) => {
    const openList = new openList_1.OpenList();
    const startNode = grid.getNode(startPoint);
    const endNode = grid.getNode(endPoint);
    startNode.opened = true;
    openList.push(startNode);
    const jump = (neighbor, node) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (!neighbor || neighbor.cost === 0)
            return null;
        if (neighbor.point.equal(endNode.point))
            return neighbor;
        const { point: neighborPoint } = neighbor;
        const { point: nodePoint } = node;
        const correctedPoint = new point_1.Point(neighborPoint.x - nodePoint.x, neighborPoint.y - nodePoint.y);
        if (correctedPoint.equal(endNode.point))
            return endNode;
        const getNode = (x, y) => grid.getNode(neighborPoint.copy(x, y));
        if (correctedPoint.x !== 0 && ((((_a = getNode(0, -1)) === null || _a === void 0 ? void 0 : _a.cost) > 0 && ((_b = getNode(-correctedPoint.x, -1)) === null || _b === void 0 ? void 0 : _b.cost) === 0)
            || (((_c = getNode(0, 1)) === null || _c === void 0 ? void 0 : _c.cost) > 0 && ((_d = getNode(-correctedPoint.x, 1)) === null || _d === void 0 ? void 0 : _d.cost) === 0)))
            return neighbor;
        else if (correctedPoint.y !== 0) {
            if ((((_e = getNode(-1, 0)) === null || _e === void 0 ? void 0 : _e.cost) > 0 && ((_f = getNode(-1, -correctedPoint.y)) === null || _f === void 0 ? void 0 : _f.cost) === 0)
                || (((_g = getNode(1, 0)) === null || _g === void 0 ? void 0 : _g.cost) > 0 && ((_h = getNode(1, -correctedPoint.y)) === null || _h === void 0 ? void 0 : _h.cost) === 0))
                return neighbor;
            if (jump(getNode(1, 0), neighbor) || jump(getNode(-1, 0), neighbor))
                return neighbor;
        }
        return jump(getNode(correctedPoint.x, correctedPoint.y), neighbor);
    };
    const identifySuccessors = (node) => {
        findNeighbors(node).map(neighbor => {
            const jumpNode = jump(neighbor, node);
            if (!jumpNode)
                return;
            if (jumpNode.closed)
                return;
            const { point: nodePoint } = node;
            const { point: jumpNodePoint } = jumpNode;
            const jumpPoint = {
                x: jumpNodePoint.x - nodePoint.x,
                y: jumpNodePoint.y - nodePoint.y
            };
            const absoluteJumpPoint = {
                x: Math.abs(jumpPoint.x),
                y: Math.abs(jumpPoint.y)
            };
            const distance = heuristic_utils_1.HeuristicUtils.Octile(absoluteJumpPoint.x, absoluteJumpPoint.y);
            // to expensive to jump
            const currentJumpCost = Math.abs(node.cost - jumpNode.cost);
            const jumpAverageCost = currentJumpCost / distance;
            if (jumpAverageCost > maxJumpCost)
                return;
            const ng = (node.g + distance) * neighbor.cost;
            if (jumpNode.opened && ng >= jumpNode.g)
                return;
            const { point: endNodePoint } = endNode;
            jumpNode.g = ng;
            jumpNode.h = jumpNode.h || heuristic_utils_1.HeuristicUtils.DrManhattan(Math.abs(jumpNodePoint.x - endNodePoint.x), Math.abs(jumpNodePoint.y - endNodePoint.y));
            jumpNode.f = jumpNode.g + jumpNode.h;
            jumpNode.parent = node;
            if (!jumpNode.opened) {
                jumpNode.opened = true;
                openList.push(jumpNode);
                return;
            }
        });
    };
    const findNeighbors = (node) => {
        const { parent, point: nodePoint } = node;
        if (!parent)
            return getNeighbors(node);
        const { point: parentPoint } = parent;
        const getNormalizedNumber = (no, pa) => (no - pa) / Math.max(Math.abs(no - pa), 1);
        const normalizedPoint = new point_1.Point(getNormalizedNumber(nodePoint.x, parentPoint.x), getNormalizedNumber(nodePoint.y, parentPoint.y));
        const neighbors = [];
        if (normalizedPoint.x !== 0) {
            const topNode = grid.getNode(nodePoint.copy(0, -1));
            if ((topNode === null || topNode === void 0 ? void 0 : topNode.cost) > 0)
                neighbors.push(topNode);
            const bottomNode = grid.getNode(nodePoint.copy(0, +1));
            if ((bottomNode === null || bottomNode === void 0 ? void 0 : bottomNode.cost) > 0)
                neighbors.push(bottomNode);
            const normalizedXNode = grid.getNode(nodePoint.copy(normalizedPoint.x, 0));
            if ((normalizedXNode === null || normalizedXNode === void 0 ? void 0 : normalizedXNode.cost) > 0)
                neighbors.push(normalizedXNode);
            return neighbors;
        }
        if (normalizedPoint.y !== 0) {
            const leftNode = grid.getNode(nodePoint.copy(-1, 0));
            if ((leftNode === null || leftNode === void 0 ? void 0 : leftNode.cost) > 0)
                neighbors.push(leftNode);
            const rightNode = grid.getNode(nodePoint.copy(1, 0));
            if ((rightNode === null || rightNode === void 0 ? void 0 : rightNode.cost) > 0)
                neighbors.push(rightNode);
            const normalizedYNode = grid.getNode(nodePoint.copy(0, normalizedPoint.y));
            if ((normalizedYNode === null || normalizedYNode === void 0 ? void 0 : normalizedYNode.cost) > 0)
                neighbors.push(normalizedYNode);
            return neighbors;
        }
    };
    const getNeighbors = (node) => {
        const neighbors = [];
        const nodePoint = node.point;
        // ↑
        const topNode = grid.getNode(nodePoint.copy(0, -1));
        if ((topNode === null || topNode === void 0 ? void 0 : topNode.cost) > 0)
            neighbors.push(topNode);
        // →
        const rightNode = grid.getNode(nodePoint.copy(1, 0));
        if ((rightNode === null || rightNode === void 0 ? void 0 : rightNode.cost) > 0)
            neighbors.push(rightNode);
        // ↓
        const bottomNode = grid.getNode(nodePoint.copy(0, 1));
        if ((bottomNode === null || bottomNode === void 0 ? void 0 : bottomNode.cost) > 0)
            neighbors.push(bottomNode);
        // ←
        const leftNode = grid.getNode(nodePoint.copy(-1, 0));
        if ((leftNode === null || leftNode === void 0 ? void 0 : leftNode.cost) > 0)
            neighbors.push(leftNode);
        return neighbors;
    };
    while (!openList.empty()) {
        const node = openList.pop();
        node.closed = true;
        if (node === endNode) {
            const getParentPoint = (_node, pointList = []) => _node.parent
                ? getParentPoint(_node.parent, [...pointList, _node.point])
                : [...pointList, _node.point];
            return getParentPoint(node)
                .reverse()
                .map(point => ({ x: point.x, y: point.y }));
        }
        identifySuccessors(node);
    }
    return [];
};
exports.findPath = findPath;
