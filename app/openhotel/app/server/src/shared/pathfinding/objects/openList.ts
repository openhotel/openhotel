import {Node} from "./node";

export class OpenList {

    private list: Node[];

    constructor() {
        this.list = [];
    }

    push(node: Node) {
        this.list.push(node);
    }

    pop(): Node {
        const poppedNode = this.list.sort((nodeA, nodeB) => nodeA.totalCost - nodeB.totalCost)[0];
        this.list = this.list.filter(node => poppedNode !== node);
        return poppedNode;
    }

    empty(): boolean {
        return this.list.length === 0;
    }

}
