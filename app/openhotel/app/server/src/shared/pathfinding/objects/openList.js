"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenList = void 0;
class OpenList {
    constructor() {
        this.list = [];
    }
    push(node) {
        this.list.push(node);
    }
    pop() {
        const poppedNode = this.list.sort((nodeA, nodeB) => nodeA.f - nodeB.f)[0];
        this.list = this.list.filter(node => poppedNode !== node);
        return poppedNode;
    }
    empty() {
        return this.list.length === 0;
    }
}
exports.OpenList = OpenList;
