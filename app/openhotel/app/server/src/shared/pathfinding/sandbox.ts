import { Grid } from "./objects/grid.ts";
import { FinderEnum } from "./finders/finder.enum.ts";
import { drawLayout } from "./utils/grid.utils.ts";

const layout = [
  [1, 1, 1, 1, null],
  [1, null, null, 1, 1, 1, 1],
  [1, null, 1, 1, 1],
  [1, null, 1, 1, 1, 1, 1, 1],
  [1, null, 1, 1, 1, 1, 1, 1],
] as number[][];

const grid = new Grid(layout);
const start = { x: 6, y: 3 };
const end = { x: 6, y: 1 };

console.log(start, "->", end);
const path = grid.findPath(start, end, 1, FinderEnum.JUMP_POINT);
console.log(path);

drawLayout(layout, path);
