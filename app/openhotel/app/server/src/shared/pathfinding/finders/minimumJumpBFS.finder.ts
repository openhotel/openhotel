import {NeighbourGraph} from "./minimumJumpBFS.enum";
import {PointInterface} from "../objects/point/point.interface";

const getChildren = (graph: NeighbourGraph, node: PointInterface, addedNodes: boolean[][]) => {
    const neighbours = graph[node.y][node.x]
    let children = [] as PointInterface[]
    if (neighbours === null) return children

    const possibleDirections = Object.keys(neighbours)

    // For each existing neighbour, we iterate in the same direction until find a wall
    possibleDirections.forEach((direction) => {
        // First case
        let newNeighbour = neighbours[direction] as PointInterface
        if (newNeighbour === null) return

        if (!addedNodes[newNeighbour.y][newNeighbour.x]) {
            children.push(newNeighbour)
            addedNodes[newNeighbour.y][newNeighbour.x] = true
        }

        // The rest
        while (graph[newNeighbour.y][newNeighbour.x]![direction]) {
            newNeighbour = graph[newNeighbour.y][newNeighbour.x]![direction]
            if (!addedNodes[newNeighbour.y][newNeighbour.x]) {
                children.push(newNeighbour)
                addedNodes[newNeighbour.y][newNeighbour.x] = true
            }
        }
    })

    return children
}

type Graph = { graph: NeighbourGraph, width: number, height: number }

// BFS using a directed graph
export const minimumJumps =({graph, width, height}: Graph, {x: startX, y: startY}: PointInterface, {x: endX, y: endY}: PointInterface) => {
    let done = false

    let addedNodes = Array(height).fill(0).map(()=>Array(width).fill(false)) as boolean[][]
    let visitedNodes = Array(height).fill(0).map(()=>Array(width).fill(false)) as boolean[][]
    let parents = Array(height).fill(0).map(()=>Array(width).fill(null)) as (PointInterface | null)[][]

    let queue = [{x: startX, y: startY}] as PointInterface[]
    addedNodes[startY][startX] = true

    while(!done && queue.length > 0) {
        const currentNode = queue.shift() as PointInterface
        visitedNodes[currentNode.y][currentNode.x] = true

        const children = getChildren(graph, currentNode, addedNodes) as PointInterface[]
        for (const {x, y} of children) {
            parents[y][x] = currentNode

            if (x === endX && y === endY) {
                done = true
            }
        }

        queue = [...queue, ...children]
    }

    if (!done) return []

    // We basically get the path backwards once we create found the node
    let end = {x: endX, y: endY}

    const steps = [] as PointInterface[]
    while (end.x !== startX || end.y !== startY) {
        steps.push(end)
        end = parents[end.y][end.x]!
    }
    return [...steps, {x: startX, y: startY}].reverse()

}