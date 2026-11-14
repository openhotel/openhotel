export type ChunksMutable = {
  isValueOverLimit: (value: unknown) => boolean;
  getChunksFromValue: (value: unknown) => Uint8Array[] | null;
  getValueFromChunks: (chunks: Uint8Array[]) => unknown;
};
