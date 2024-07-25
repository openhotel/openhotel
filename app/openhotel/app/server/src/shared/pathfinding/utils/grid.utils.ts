import { PointInterface } from "../objects/point/point.interface.ts";

export const makeSquare = (layout: number[][]): number[][] => {
  const maxLength = Math.max(layout.length, ...layout.map((row) => row.length));
  const squareLayout = Array.from({ length: maxLength }, () =>
    Array(maxLength).fill(null),
  );

  for (let i = 0; i < layout.length; i++) {
    for (let j = 0; j < layout[i].length; j++) {
      squareLayout[i][j] = layout[i][j];
    }
  }

  return squareLayout;
};

export const drawLayout = (layout: number[][], path: PointInterface[]) => {
  const map: any[] = layout.map((row) => row.map((cell) => (cell ? "." : "#")));

  path.forEach((point) => {
    map[point.y][point.x] = "P";
  });

  const mapString = map.map((row) => row.join(" ")).join("\n");
  console.log(mapString);
};
