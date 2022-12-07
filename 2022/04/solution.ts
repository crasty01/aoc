type Input = Array<Line>;
type Line = [Pair, Pair];
type Pair = [number, number];

const contains = (a: Pair, b: Pair): boolean => {
  return b[0] >= a[0] && b[0] <= a[1] && b[1] >= a[0] && b[1] <= a[1];
}

const overlap = (a: Pair, b: Pair): boolean => {
  return b[0] >= a[0] && b[0] <= a[1] || b[1] >= a[0] && b[1] <= a[1];
}

export const parseInput = (rawInut: string): Input => {
  return rawInut.split("\r\n").map((line) => {
    return line.split(",").map((pair) => {
      return pair.split("-").map(number => parseInt(number, 10)) as Pair
    }) as Line
  });
};

export const solution1 = (input: Input): number | string => {
  let s = 0;
  for (const line of input) {
    if (contains(line[0], line[1]) || contains(line[1], line[0])) s += 1;
  }
  return s;
};

export const solution2 = (input: Input): number | string => {
  let s = 0;
  for (const line of input) {
    if (overlap(line[0], line[1]) || overlap(line[1], line[0])) s += 1;
  }
  return s;
};
