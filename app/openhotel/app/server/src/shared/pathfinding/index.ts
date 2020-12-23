import {Grid} from "./core/grid";
import {Point} from "./core/point";

const grid = new Grid([
    [3, 4, 5, 6, 7],
    [2, 0, 0, 0, 8],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [99, 99, 99, 99, 1],
]);

const path = grid.findPath(new Point(0, 2), new Point(4, 2));

console.log(path)
