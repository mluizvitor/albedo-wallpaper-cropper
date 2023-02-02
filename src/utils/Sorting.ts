/* eslint-disable @typescript-eslint/no-explicit-any */
export function Sorting(a: any, b: any) {
  const comparator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: 'base',
  });

  return comparator.compare(a, b);
}