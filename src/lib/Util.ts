export const randomBetween = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const closeEnough = (
  value: number,
  target: number,
  range: number = 15
): boolean => value > target - range && value < target + range;
