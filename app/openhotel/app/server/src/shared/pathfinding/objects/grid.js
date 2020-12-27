"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grid = void 0;
const node_1 = require("./node");
const point_1 = require("./point/point");
const jumpPoint_finder_1 = require("../finders/jumpPoint.finder");
const finder_enum_1 = require("../finders/finder.enum");
class Grid {
    constructor(matrix) {
        this._matrix = matrix;
        this._height = matrix.length;
        this._width = matrix[0].length;
        this.nodes = this._matrix.map((arrY, y) => arrY.map((cost, x) => new node_1.Node(new point_1.Point(x, y), cost)));
    }
    getNode(point) {
        const yNodes = this.nodes[point.y];
        return yNodes ? yNodes[point.x] : null;
    }
    clone() {
        return new Grid(this._matrix);
    }
    findPath(startPoint, endPoint, maxJumpCost = 5, finderEnum = finder_enum_1.FinderEnum.JUMP_POINT) {
        switch (finderEnum) {
            case finder_enum_1.FinderEnum.JUMP_POINT:
                return jumpPoint_finder_1.findPath(new point_1.Point(startPoint.x, startPoint.y), new point_1.Point(endPoint.x, endPoint.y), maxJumpCost, this.clone());
        }
    }
}
exports.Grid = Grid;
