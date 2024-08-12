import { Size2d } from "shared/types";

/**
 * Code courtesy of @voidpixel
 *
 * Calculate the polygon coordinates of a tile based on the given width and height.
 * Edges:
 *
 *       CD (x)
 *      /\
 *     /  \
 * AB /    \
 *    \    /  EF (x) + (y)
 *     \  /
 *      \/
 *      GH (y)
 *
 * @param {object} size - The size of the tile.
 * @param {number} size.width - The width of the tile.
 * @param {number} size.height - The height of the tile.
 * @returns {number[]} - The array of polygon coordinates [polA, polB, polC, polD, polE, polF, polG, polH].
 */
export const getTilePolygon = ({ width, height }: Size2d): number[] => {
  // DON'T TOUCH THIS ******* *******, THIS FIXES THE PIXEL PERFECT ON GRAPHICS
  // IF YOU WANT TO CHECK IF IT WORKS, TAKE A PICTURE AND CHECK IT ON ASEPRITE
  const xMargin = -2;
  const yMargin = 0;

  // Edge AB
  const polA = xMargin;
  const polB = yMargin;

  // Edge CD
  const polC = -width * 2 + xMargin;
  const polD = width + yMargin;

  // Edge EF
  const polE = -width * 2 + height * 2 + xMargin;
  const polF = width + height + yMargin;

  // Edge GH
  const polG = height * 2 + xMargin;
  const polH = height + yMargin;

  return [polA, polB, polC, polD, polE, polF, polG, polH];
};
