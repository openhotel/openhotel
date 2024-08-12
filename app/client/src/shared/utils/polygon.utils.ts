import { Size2d } from "shared/types";

type BorderPolygonProps = {
  size: Size2d;
  border: number;
};

export const getBorderPolygon = ({ size, border }: BorderPolygonProps) => [
  0,
  0,
  //
  size.width,
  0,
  //
  size.width,
  size.height,
  //
  0,
  size.height,
  //////////
  0,
  0,
  //
  border,
  0,
  //
  border,
  size.height - border,
  //
  size.width - border,
  size.height - border,
  //
  size.width - border,
  border,
  //
  border,
  border,
];
