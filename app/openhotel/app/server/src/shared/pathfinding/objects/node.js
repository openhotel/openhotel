"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;
class Node {
    constructor(point, cost) {
        this.point = point;
        this.cost = cost;
        this.g = 0;
        this.f = 0;
    }
}
exports.Node = Node;
