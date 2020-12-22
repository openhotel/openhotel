
type Grid = {
    size: {
        width: number,
        height: number
    };
    path: number[];
}

type NodeType = {
    index: number;
    x: number;
    y: number;
    cost: number;
    node?: NodeType;
}

const grid: Grid = {
    size: {
        width: 5,
        height: 5
    },
    path: [
        1, 2, 1, 1, 1,
        1, 2, 1, 1, 1,
        1, 2, 0, 1, 1,
        1, 1, 1, 1, 1,
        1, 1, 1, 1, 1,
    ]
}


const target = {
    from: {x: 0, y: 0},
    to: {x: 3, y: 4}
}

const nodes = grid.path.map<NodeType>((cost, index) => {

    return {
        index,
        cost,
        x: index % grid.size.width,
        y: Math.trunc(index / grid.size.height)
    }
}).filter(node => node.cost > 0);


const initialNode = nodes.find(node => node.x === target.from.x && node.y === target.from.y);
const targetNode = nodes.find(node => node.x === target.to.x && node.y === target.to.y);

const targetNodes = [...nodes];

const getNodeCandidates = (node: NodeType) => [{ x: -1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }, { x: 0, y: -1 }]
    .map(position => targetNodes.find(_node => _node.x === node.x + position.x && _node.y === node.y + position.y))
    .filter(_node => _node)
    .sort((nodeA, nodeB) => nodeA.cost - nodeB.cost)

console.log(getNodeCandidates(initialNode))