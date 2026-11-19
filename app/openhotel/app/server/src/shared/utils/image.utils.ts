export const quantizeToPalette = async (
  Image,
  palette: number[],
  data: Uint8Array,
) => {
  const sourceImage = await Image.decode(data);

  if (!palette) return await sourceImage.encodePNG();

  const $palette = palette.map((color) => {
    const r = (color >>> 16) & 0xff;
    const g = (color >>> 8) & 0xff;
    const b = color & 0xff;
    // Store RGB in a 32-bit int, with alpha set to 255 (opaque)
    return (r << 24) | (g << 16) | (b << 8) | 0xff;
  });

  for (let y = 0; y < sourceImage.height; y++) {
    for (let x = 0; x < sourceImage.width; x++) {
      const px = sourceImage.getPixelAt(x, y);
      const pr = (px >>> 24) & 0xff;
      const pg = (px >>> 16) & 0xff;
      const pb = (px >>> 8) & 0xff;

      let best = $palette[0];
      let bestDist = Infinity;

      for (const currentColor of $palette) {
        const r = (currentColor >>> 24) & 0xff;
        const g = (currentColor >>> 16) & 0xff;
        const b = (currentColor >>> 8) & 0xff;
        // Euclidean distance in RGB space
        const dr = r - pr,
          dg = g - pg,
          db = b - pb;
        const dist = dr * dr + dg * dg + db * db;

        if (dist < bestDist) {
          bestDist = dist;
          best = currentColor;
          if (dist === 0) break;
        }
      }

      sourceImage.setPixelAt(x, y, best);
    }
  }

  return await sourceImage.encode();
};
