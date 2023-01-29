export function getScaleFactor(number: number, compare: number) {
  return Math.ceil(compare / number);
}