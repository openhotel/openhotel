"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point = void 0;
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    copy(x, y) {
        return new Point(this.x + x, this.y + y);
    }
    equal(point) {
        return this.x === point.x && this.y === point.y;
    }
}
exports.Point = Point;
