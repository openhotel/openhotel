import { Point } from "@shared/types/point.types.ts";
import { OpenList } from "@shared/types/open-list.types.ts";
import { OPEN_LIST_MIN_CAPACITY } from "@shared/consts/finder.consts.ts";

let capacity = 0;
let nodeIndex = new Int32Array(0);
let nodeFrom = new Int32Array(0);
let nodeCost = new Float64Array(0);
let nodeScore = new Float64Array(0);
let heapNode = new Int32Array(0);
let heapOrder = new Float64Array(0);

const grow = <T extends Int32Array | Float64Array>(
  array: T,
  Ctor: new (size: number) => T,
  size: number,
): T => {
  const grown = new Ctor(size);
  grown.set(array);
  return grown;
};

const ensureCapacity = (size: number) => {
  if (size <= capacity) return;
  let next = Math.max(capacity * 2, OPEN_LIST_MIN_CAPACITY);
  while (next < size) next *= 2;

  nodeIndex = grow(nodeIndex, Int32Array, next);
  nodeFrom = grow(nodeFrom, Int32Array, next);
  nodeCost = grow(nodeCost, Float64Array, next);
  nodeScore = grow(nodeScore, Float64Array, next);
  heapNode = grow(heapNode, Int32Array, next);
  heapOrder = grow(heapOrder, Float64Array, next);
  capacity = next;
};

export const createOpenList = (travelHeuristic: Float32Array): OpenList => {
  let nodeCount = 0;
  let head = -1;
  let heapSize = 0;
  let order = 0;

  const heapInsert = (node: number, nodeOrder: number) => {
    const score = nodeScore[node];
    let i = heapSize++;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      const parentNode = heapNode[parent];
      const parentScore = nodeScore[parentNode];
      if (
        parentScore < score ||
        (parentScore === score && heapOrder[parent] > nodeOrder)
      )
        break;
      heapNode[i] = parentNode;
      heapOrder[i] = heapOrder[parent];
      i = parent;
    }
    heapNode[i] = node;
    heapOrder[i] = nodeOrder;
  };

  const heapPop = (): number => {
    const top = heapNode[0];
    const lastNode = heapNode[--heapSize];
    const lastOrder = heapOrder[heapSize];
    const lastScore = nodeScore[lastNode];
    let i = 0;
    while (true) {
      let child = 2 * i + 1;
      if (child >= heapSize) break;
      const right = child + 1;
      if (right < heapSize) {
        const childScore = nodeScore[heapNode[child]];
        const rightScore = nodeScore[heapNode[right]];
        if (
          rightScore < childScore ||
          (rightScore === childScore && heapOrder[right] > heapOrder[child])
        )
          child = right;
      }
      const childScore = nodeScore[heapNode[child]];
      if (
        lastScore < childScore ||
        (lastScore === childScore && lastOrder > heapOrder[child])
      )
        break;
      heapNode[i] = heapNode[child];
      heapOrder[i] = heapOrder[child];
      i = child;
    }
    heapNode[i] = lastNode;
    heapOrder[i] = lastOrder;
    return top;
  };

  const push = (index: number, from: number, cost: number) => {
    if (nodeCount === capacity) ensureCapacity(nodeCount + 1);
    const node = nodeCount++;
    nodeIndex[node] = index;
    nodeFrom[node] = from;
    nodeCost[node] = cost;
    nodeScore[node] = cost + travelHeuristic[index];

    if (head === -1) {
      head = node;
    } else if (nodeScore[node] < nodeScore[head]) {
      heapInsert(head, ++order);
      head = node;
    } else {
      heapInsert(node, ++order);
    }
  };

  const pop = (): number => {
    if (head === -1) throw new Error("popping from an empty list");
    const node = head;
    head = heapSize > 0 ? heapPop() : -1;
    return node;
  };

  const isEmpty = (): boolean => head === -1;

  const getIndex = (node: number): number => nodeIndex[node];

  const getCost = (node: number): number => nodeCost[node];

  const getPath = (node: number, startPoint: Point, height: number) => {
    const path: Point[] = [];
    while (nodeFrom[node] !== -1) {
      const index = nodeIndex[node];
      const x = index % height;
      path.push({ x, y: (index - x) / height });
      node = nodeFrom[node];
    }
    path.push(startPoint);
    return path.reverse();
  };

  return {
    push,
    pop,
    isEmpty,
    getIndex,
    getCost,
    getPath,
  };
};
