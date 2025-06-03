import { estimateSize } from "@deno/kv-utils";
import { encode, decode } from "cborx";

const CHUNK_SIZE = 65536;

export const chunks = () => {
  const isValueOverLimit = (value: unknown): boolean =>
    estimateSize(value) > CHUNK_SIZE;

  const getChunksFromValue = (value: unknown): Uint8Array[] | null => {
    if (!isValueOverLimit(value)) return null;

    const chunks: Uint8Array[] = [];

    const encoded = encode(value);
    for (let i = 0; i < encoded.length; i += CHUNK_SIZE)
      chunks.push(encoded.slice(i, i + CHUNK_SIZE));

    return chunks;
  };

  const getValueFromChunks = (chunks: Uint8Array[]): unknown => {
    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const merged = new Uint8Array(totalLength);

    let offset = 0;
    for (const chunk of chunks) {
      merged.set(chunk, offset);
      offset += chunk.length;
    }

    return decode(merged);
  };

  return {
    isValueOverLimit,

    getChunksFromValue,
    getValueFromChunks,
  };
};
