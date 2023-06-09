/**
 * Convert number to ordinal number.
 * @param num The number to convert to ordinal number.
 * @returns The ordinal number.
 */
export default (num: number): string => {
  if (typeof num !== 'number') throw new TypeError('Expected a number');
  if (num < 0) return '';

  const suffixes = ['th', 'st', 'nd', 'rd'];
  const remainder = num % 100;
  const extension = (suffixes[(remainder - 20) % 10] ??
    suffixes[remainder] ??
    suffixes[0]) as string;
  return `${num}${extension}`;
};
