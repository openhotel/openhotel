import { PointInterface } from "../objects/point/point.interface"

export type Neighbours = {  N?:PointInterface, E?:PointInterface, S?:PointInterface, W?:PointInterface }
export type NeighbourGraph = Readonly<Array<Array<Neighbours | null>>>