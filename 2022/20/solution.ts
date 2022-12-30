type Input = Array<number>;

export const parseInput = (rawInut: string): Input => {
  return rawInut.split('\r\n').map((line) => parseInt(line, 10));
}

export const solution1 = (input: Input, run = false): number =>  {
  if (!run) return -1;
  return 0;
}

export const solution2 = (input: Input, run = false): number =>  {
  if (!run) return -1;
  return 0;
}

const example = `1\r\n2\r\n-3\r\n3\r\n-2\r\n0\r\n4`;
console.log('Example 1:', solution1(parseInput(example), true));
// console.log('Example 2:', solution2(parseInput(example), true));