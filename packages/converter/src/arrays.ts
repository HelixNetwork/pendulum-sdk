/**
 * Concatenate multiple arrays
 * @param resultConstructor
 * @param arrays
 */
export function concatenate(resultConstructor: any, ...arrays: any[]) {
  let totalLength = 0;
  for (const arr of arrays) {
    totalLength += arr.length;
  }
  const result = new resultConstructor(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}
