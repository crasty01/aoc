type Input = string;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (input: string): string => {
  return input;
};

const countOnes = (n: number) => {
  let count = 0;
  while (n >= 1) { count += n & 1; n = n >> 1; }
  return count;
};

const binarySolution = (input: Input, CHARS: number): number | string => {
  let filter = 0;
  for (let i = 0; i < CHARS - 1; i++) {
    const c = input[i].charCodeAt(0);
    filter ^= 1 << (c % 32);
  }
  for (let i = 0; i < input.length - CHARS - 1; i++) {
    const f = input[i].charCodeAt(0);
    const l = input[i + CHARS - 1].charCodeAt(0);
    filter ^= 1 << (l % 32);
    if (countOnes(filter) === CHARS) return i + CHARS;
    filter ^= 1 << (f % 32);
  }
  return -1;
}

solutions[0] = (input: Input): number | string => {
  return binarySolution(input, 4)
}

solutions[1] = (input: Input): number | string => {
  return binarySolution(input, 14)
}