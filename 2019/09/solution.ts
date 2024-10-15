import { intcode } from "/2019/intcode.ts";

type Input = Array<number>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split(',').map(e => parseInt(e, 10));
}

solutions[0] = (memory: Input, run = false): number =>  {
  const result = [...intcode({ inputs: [1], memory })];

	return result[result.length - 1];
}

solutions[1] = (memory: Input, run = false): number =>  {
  const result = [...intcode({ inputs: [2], memory })];

	return result[result.length - 1];
}