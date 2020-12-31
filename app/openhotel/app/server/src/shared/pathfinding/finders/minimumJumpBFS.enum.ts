import { PointInterface } from "../objects/point/point.interface"

export type Neightbours = {  N?:PointInterface, E?:PointInterface, S?:PointInterface, W?:PointInterface }
export type NeightbourGraph = Readonly<Array<Array<Neightbours | null>>>