export const getUint8ArrayFromReadableStream = async (
  stream: ReadableStream<Uint8Array> | Uint8Array,
): Promise<Uint8Array> => {
  if (stream instanceof Uint8Array) return stream;

  const reader = stream.getReader();
  const chunks = [];

  // Read the stream chunk by chunk
  let done = false;
  while (!done) {
    const { value, done: doneReading } = await reader.read();
    if (value) {
      chunks.push(value);
    }
    done = doneReading;
  }

  // Calculate the total size of the resulting Uint8Array
  const totalSize = chunks.reduce((acc, chunk) => acc + chunk.length, 0);

  // Merge all chunks into a single Uint8Array
  const result = new Uint8Array(totalSize);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
};
