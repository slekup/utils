/**
 * Returns true if the random number is less than the percent.
 * @param percent The percent chance of returning true.
 * @returns True if the random number is less than the percent.
 */
const chance = (percent: number): boolean => Math.random() * 100 < percent;

export default chance;
