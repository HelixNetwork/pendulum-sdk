/**
 * Concatenate multiple arrays
 * @param ResultConstructor
 * @param arrays
 */
export function concatenate(ResultConstructor: any, ...arrays: any[]) {
  let totalLength = 0;
  for (const arr of arrays) {
    totalLength += arr.length;
  }
  const result = new ResultConstructor(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}
