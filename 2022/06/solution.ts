type Input = string;

export const parseInput = (input: string): string => {
  return input;
};

const unique = (input: string): boolean => input.length === new Set([...input]).size;

export const solution1 = (input: Input): number | string =>  {
  const CHARS = 4;
  let last = input.slice(0, CHARS - 1);
  for (let i = CHARS - 1; i < input.length; i++) {
    last = last.slice(-1 * (CHARS - 1)) + input[i];
    if (unique(last)) return i + 1;
  }
  return -1;
}

export const solution2 = (input: Input): number | string =>  {
  const CHARS = 14;
  let last = input.slice(0, CHARS - 1);
  for (let i = CHARS - 1; i < input.length; i++) {
    last = last.slice(-1 * (CHARS - 1)) + input[i];
    if (unique(last)) return i + 1;
  }
  return -1;
}