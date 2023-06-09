/**
 * Splits an array into chunks.
 * @param array The array to split.
 * @param max The maximum size of each chunk.
 * @returns The array split into chunks.
 */
const splitArray = (array: unknown[], max: number): unknown[][] => {
  if (!Array.isArray(array)) throw new TypeError('Expected an array');
  if (typeof max !== 'number') throw new TypeError('Expected a number');
  if (max < 1) return [];
  if (max >= array.length) return [array];

  const result = array.reduce(
    (resultArray: unknown[][], item: unknown, index: number) => {
      const newArray: unknown[][] = [...resultArray];
      const chunkIndex: number = Math.floor(index / max);

      if (!newArray[chunkIndex]) {
        // Start a new chunk
        newArray[chunkIndex] = [];
      }

      if (newArray[chunkIndex]) {
        // Add the item to the chunk
        (newArray[chunkIndex] as unknown[]).push(item);
      }

      return newArray;
    },
    []
  );

  return result;
};

export default splitArray;
