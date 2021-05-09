import {Grid} from "./objects/grid";
// @ts-ignore
import {smallGrid} from "../__tests__/test-data/small-grid";
import {FinderEnum} from "./finders/finder.enum";

const a = [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, 0, 0, null],
    [4, 2, 0, -2, -4],
    [0, null, null, null, null]
] as number[][];


const grid = new Grid(a);

console.log(
    grid.findPath({ x: 0, y: 3 }, { x: 4, y: 3 }, 5)
);