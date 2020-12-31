import {NeightbourGraph} from "./minimumJumpBFS.enum";
import {PointInterface} from "../objects/point/point.interface";

const getChildren = (graph: NeightbourGraph, node: PointInterface, addedNodes: boolean[][]) => {
    const neightboors = graph[node.y][node.x]
    let children = [] as PointInterface[]
    if (neightboors === null) return children

    const possibleDirections = Object.keys(neightboors)

    // For each existing neightboor, we iterate in the same direction until find a wall
    possibleDirections.forEach((direction) => {
        // First case
        let newNeightbour = neightboors[direction] as PointInterface
        if (newNeightbour === null) return

        if (!addedNodes[newNeightbour.y][newNeightbour.x]) {
            children.push(newNeightbour)
            addedNodes[newNeightbour.y][newNeightbour.x] = true
        }

        // The rest
        while (graph[newNeightbour.y][newNeightbour.x]![direction]) {
            newNeightbour = graph[newNeightbour.y][newNeightbour.x]![direction]
            if (!addedNodes[newNeightbour.y][newNeightbour.x]) {
                children.push(newNeightbour)
                addedNodes[newNeightbour.y][newNeightbour.x] = true
            }
        }
    })

    return children
}

type Graph = { graph: NeightbourGraph, width: number, height: number }

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