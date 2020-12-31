import {NeighbourGraph, Neighbours} from "../finders/minimumJumpBFS.enum";
import {minimumJumps} from "../finders/minimumJumpBFS.finder";
import {PointInterface} from "./point/point.interface";

export class Graph {
    public height: number
    public width: number
    public graph: NeighbourGraph

    constructor(raw: number[][], jumpCost: number) {
        if (raw.length === 0 || raw[0].length === 0 ) {
            throw ReferenceError('grid matrix cannot be empty');
        }
        this.height = raw.length
        this.width = raw[0].length

        this.graph = this.transformToGrid(raw, jumpCost)
    }

    public findPath(startPoint: PointInterface, endPoint: PointInterface) {
        if (!this.graph[startPoint.y]?.[startPoint.x]) {
            throw ReferenceError('startNode does not exist in the grid');
        }
        if (!this.graph[endPoint.y]?.[endPoint.x]) {
            throw ReferenceError('endNode does not exist in the grid');
        }
        return minimumJumps(this, startPoint, endPoint)
    }

    private transformToGrid(raw: number[][], jumpCost: number) : NeighbourGraph {
        return raw.map((row, indexY) => {
            return row.map((val, indexX) => {
                if (val === 0) return null

                let neightbours = {} as Neighbours

                if (indexY - 1 >= 0 && indexY - 1 < this.height ) {
                    const neightbourVal = raw[indexY - 1][indexX]
                    if (neightbourVal !== 0 && Math.abs(neightbourVal - val) <= jumpCost ) {
                        neightbours.N = {x: indexX, y: indexY - 1}
                    }
                }
                if (indexY + 1 >= 0 && indexY + 1 < this.height ) {
                    const neightbourVal = raw[indexY + 1][indexX]
                    if (neightbourVal !== 0 && Math.abs(neightbourVal - val) <= jumpCost ) {
                        neightbours.S = {x: indexX, y: indexY + 1}
                    }
                }
                if (indexX - 1 >= 0 && indexX - 1 < this.width ) {
                    const neightbourVal = raw[indexY][indexX - 1]
                    if (neightbourVal !== 0 && Math.abs(neightbourVal - val) <= jumpCost ) {
                        neightbours.W = {x: indexX - 1, y: indexY}
                    }
                }
                if (indexX + 1 >= 0 && indexX + 1 < this.width ) {
                    const neightbourVal = raw[indexY][indexX + 1]
                    if (neightbourVal !== 0 && Math.abs(neightbourVal - val) <= jumpCost ) {
                        neightbours.E = {x: indexX + 1, y: indexY}
                    }
                }

                return neightbours

            })
        })
    }
}