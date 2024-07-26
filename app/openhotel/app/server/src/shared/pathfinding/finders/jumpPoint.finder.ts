import { Grid } from "../objects/grid.ts";
import { Point } from "../objects/point/point.ts";
import { PointInterface } from "../objects/point/point.interface.ts";
import { DirectionNode } from "../objects/nodes/directionNode.ts";
import { DirectionEnum } from "../objects/nodes/direction.enum.ts";
import { Node } from "../objects/nodes/node.ts";
import { FindPathConfig } from "./finder.types.ts";

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
  startPoint: PointInterface,
  endPoint: PointInterface,
  grid: Grid,
  config: FindPathConfig,
): PointInterface[] => {
  const nodes: (DirectionNode | null)[][] = buildNodes(
    grid,
    config.maxJumpCost ?? 5,
  );
  const getNode = (point: PointInterface): Node | DirectionNode | null => {
    if (nodes[point.y] === undefined) return null;
    return nodes[point.y][point.x];
  };

  const startNode: DirectionNode | null = getNode(startPoint) as DirectionNode;
  const endNode: DirectionNode | null = getNode(endPoint) as DirectionNode;

  if (startNode === null) {
    throw new Error("startNode does not exist in the grid");
  }

  if (endNode === null) throw new Error("endNode does not exist in the grid");

  const getChildren = (
    nodes: DirectionNode[][],
    node: PointInterface,
    addedNodes: boolean[][],
  ) => {
    const neighbor: DirectionNode = nodes[node.y][node.x];
    const children = [] as PointInterface[];
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

  function getEmptyArrayFromSize<T>(fill: T): T[][] {
    return Array(height)
      .fill(0)
      .map(() => Array(width).fill(fill));
  }

  const addedNodes = getEmptyArrayFromSize(false);
  const visitedNodes = getEmptyArrayFromSize(false);
  const parents = getEmptyArrayFromSize(null) as (PointInterface | null)[][];

  let queue = [startPoint] as PointInterface[];
  addedNodes[startPoint.y][startPoint.x] = true;

  while (!done && queue.length > 0) {
    const currentNode = queue.shift() as PointInterface;
    visitedNodes[currentNode.y][currentNode.x] = true;

    const children = getChildren(
      nodes as DirectionNode[][],
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

  let end: PointInterface = new Point(endPoint.x, endPoint.y);
  const steps = [] as PointInterface[];
  while (end.x !== startPoint.x || end.y !== startPoint.y) {
    steps.push(end);
    end = parents[end.y][end.x]!;
  }
  return [...steps, startPoint].reverse();
};

const buildNodes = (
  grid: Grid,
  maxJumpCost: number,
): (DirectionNode | null)[][] => {
  return grid.mapMatrix((x, y, cost) => {
    if (cost === null) return null;

    const directionNode = new DirectionNode(new Point(x, y));

    const assignDirectionNodeIf = (comparison: boolean, point: Point) => {
      if (!comparison) return null;
      const nodePoint = new Point(
        directionNode.point.x + point.x,
        directionNode.point.y + point.y,
      );
      const neighborCost = grid.getHeightAt(nodePoint);

      return neighborCost !== null &&
        Math.abs(neighborCost - cost) <= maxJumpCost
        ? nodePoint
        : null;
    };

    directionNode.northNode = assignDirectionNodeIf(
      y - 1 >= 0 && y - 1 < grid.height,
      new Point(0, -1),
    );
    directionNode.southNode = assignDirectionNodeIf(
      y + 1 >= 0 && y + 1 < grid.height,
      new Point(0, 1),
    );
    directionNode.westNode = assignDirectionNodeIf(
      x - 1 >= 0 && x - 1 < grid.width,
      new Point(-1, 0),
    );
    directionNode.eastNode = assignDirectionNodeIf(
      x + 1 >= 0 && x + 1 < grid.width,
      new Point(1, 0),
    );

    // Add diagonals
    directionNode.northWestNode = assignDirectionNodeIf(
      y - 1 >= 0 && x - 1 >= 0,
      new Point(-1, -1),
    );
    directionNode.northEastNode = assignDirectionNodeIf(
      y - 1 >= 0 && x + 1 < grid.width,
      new Point(1, -1),
    );
    directionNode.southWestNode = assignDirectionNodeIf(
      y + 1 < grid.height && x - 1 >= 0,
      new Point(-1, 1),
    );
    directionNode.southEastNode = assignDirectionNodeIf(
      y + 1 < grid.height && x + 1 < grid.width,
      new Point(1, 1),
    );

    return directionNode;
  });
};
