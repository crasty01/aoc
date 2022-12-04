import { sum } from '/src/lib/math.ts';

type Input = Array<number | null>; 

export const parseInput = (rawInut: string): Input => {
  return rawInut.split('\r\n').map((line: string) => line === '' ? null : parseInt(line));
}

export const solution1 = (input: Input): number | string =>  {
  let max = -Infinity;
  let sum = 0;
  for (let i = 0; i < input.length + 1; i++) {
    if (!input[i]) {
      if (sum > max) max = sum;
      sum = 0;
      continue;
    }

    sum += input[i]!;
  }
  return max;
}

export const solution2 = (input: Input): number | string =>  {
  let max = Array.from({ length: 3 }, () => -Infinity);
  {
    let sum = 0;
    for (let i = 0; i < input.length + 1; i++) {
      max = max.sort((a,b) => a - b);
      if (!input[i]) {
        if (sum > max[0]) max[0] = sum;
        sum = 0;
        continue;
      }

      sum += input[i]!;
    }
  }
  return sum(max);
}