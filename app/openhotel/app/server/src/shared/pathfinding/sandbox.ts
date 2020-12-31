import {Grid} from "./objects/grid";
// @ts-ignore
import {smallGrid} from "../__tests__/test-data/small-grid";
import {FinderEnum} from "./finders/finder.enum";

const grid = new Grid(smallGrid, "directionNode");

console.log(
    grid.findPath({ x: 4, y: 2 }, { x: 4, y: 1 }, 5, FinderEnum.JUMP_POINT_2)
);
