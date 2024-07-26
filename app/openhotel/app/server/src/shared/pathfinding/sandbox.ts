import { Grid } from "./objects/grid.ts";
import { FinderEnum } from "./finders/finder.enum.ts";
import { drawLayout, transpose } from "./utils/grid.utils.ts";

const original = [
  [0, 0, 0, 2, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 0, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 1, 1],
  [2, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 0, 1, 1],
];

const layout = transpose(original); // (original);

const grid = Grid.from(layout);
const start = { x: 2, y: 6 };
const end = { x: 5, y: 9 };

console.log(start, "->", end);
const path = grid.findPath(start, end, {
  finder: FinderEnum.JUMP_POINT,
  maxJumpCost: 1,
});
console.log(path);

drawLayout(layout, path, start, end);
