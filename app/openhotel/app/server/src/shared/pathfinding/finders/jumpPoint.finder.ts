import { Grid } from "../objects/grid.ts";
import { Point } from "../objects/point/point.ts";
import { PointInterface } from "../objects/point/point.interface.ts";
import { DirectionNode } from "../objects/nodes/directionNode.ts";
import { DirectionEnum } from "../objects/nodes/direction.enum.ts";

const possibleDirections: DirectionEnum[] = [
  DirectionEnum.NORTH,
  DirectionEnum.EAST,
  DirectionEnum.SOUTH,
  DirectionEnum.WEST,
  DirectionEnum.NORTH_WEST,
  DirectionEnum.NORTH_EAST,
  DirectionEnum.SOUTH_WEST,
  DirectionEnum.SOUTH_EAST,
];

export const findPath = (
  startPoint: Point,
  endPoint: Point,
  grid: Grid,
): PointInterface[] => {
  const startNode: DirectionNode | null = grid.getNode(
    startPoint,
  ) as DirectionNode;
  const endNode: DirectionNode | null = grid.getNode(endPoint) as DirectionNode;

  if (startNode === null)
    throw new Error("startNode does not exist in the grid");

  if (endNode === null) throw new Error("endNode does not exist in the grid");

  const getChildren = (
    nodes: DirectionNode[][],
    node: PointInterface,
    addedNodes: boolean[][],
  ) => {
    const neighbor: DirectionNode = nodes[node.y][node.x];
    let children = [] as PointInterface[];
    if (neighbor === null || neighbor === undefined) return children;

    possibleDirections.forEach((direction) => {
      let newNeighbor: Point | null = neighbor?.getNeighbor(direction) as Point;
      if (newNeighbor === null) return;

      if (!addedNodes[newNeighbor.y][newNeighbor.x]) {
        children.push(newNeighbor);
        addedNodes[newNeighbor.y][newNeighbor.x] = true;
      }

      // The rest
      while (
        newNeighbor &&
        nodes[newNeighbor.y][newNeighbor.x]!.getNeighbor(direction)
      ) {
        newNeighbor =
          nodes[newNeighbor.y][newNeighbor.x]!.getNeighbor(direction);
        if (newNeighbor && !addedNodes[newNeighbor.y][newNeighbor.x]) {
          children.push(newNeighbor);
          addedNodes[newNeighbor.y][newNeighbor.x] = true;
        }
      }
    });

    return children;
  };

  const { width, height } = grid;

  let done = false;

  const getEmptyArrayFromSize = (fill: any) =>
    Array(height)
      .fill(0)
      .map(() => Array(width).fill(fill));

  const addedNodes = getEmptyArrayFromSize(false) as boolean[][];
  const visitedNodes = getEmptyArrayFromSize(false) as boolean[][];
  const parents = getEmptyArrayFromSize(null) as (PointInterface | null)[][];

  let queue = [startPoint] as PointInterface[];
  addedNodes[startPoint.y][startPoint.x] = true;

  while (!done && queue.length > 0) {
    const currentNode = queue.shift() as PointInterface;
    visitedNodes[currentNode.y][currentNode.x] = true;

    const children = getChildren(
      grid.nodes as DirectionNode[][],
      currentNode,
      addedNodes,
    ) as PointInterface[];
    for (const { x, y } of children) {
      parents[y][x] = currentNode;

      if (x === endPoint.x && y === endPoint.y) done = true;
    }

    queue = [...queue, ...children];
  }

  if (!done) return [];

  // We basically get the path backwards once we create found the node

  let end: PointInterface = endPoint.copy(0, 0);
  const steps = [] as PointInterface[];
  while (end.x !== startPoint.x || end.y !== startPoint.y) {
    steps.push(end);
    end = parents[end.y][end.x]!;
  }
  return [...steps, startPoint].reverse();
};
