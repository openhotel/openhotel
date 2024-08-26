import React, { useEffect, useState } from "react";
import { FurnitureBounds } from "shared/types";
import { TILE_IMAGE } from "shared/consts";
import { getPositionFromIsometricPosition } from "shared/utils";

type TileProps = {
  scale?: number;
  x: number;
  z: number;
};
const Tile = ({ scale, x, z }: TileProps) => {
  const position = getPositionFromIsometricPosition({ x, z });
  return (
    <img
      alt=""
      src={TILE_IMAGE}
      style={{
        position: "absolute",
        width: 50 * scale,
        height: 28 * scale,
        left: position.x * scale - 1 * scale,
        top: position.y * scale,
        filter: `brightness(${(x + z) % 2 === 0 ? 50 : 100}%)`,
      }}
    />
  );
};

type Props = {
  size: FurnitureBounds;
  scale?: number;
  children?: React.ReactNode;
};
export const SceneComponent: React.FC<Props> = ({
  size,
  scale = 1,
  children,
}) => {
  const [tiles, setTiles] = useState([]);

  useEffect(() => {
    const $tiles = [];
    for (let x = 0; x < size.width; x++)
      for (let z = 0; z < size.depth; z++)
        $tiles.push(<Tile key={`${x}.${z}`} scale={scale} x={x} z={z} />);

    setTiles($tiles);
  }, [size]);

  return (
    <div
      style={{
        position: "relative",
        width: `${48 * scale}px`,
        height: `152px`,
        margin: `0 ${48 * scale}px`,
        marginTop: `100px`,
      }}
    >
      {tiles}
      {children}
    </div>
  );
};
