import { intcode } from "/2019/intcode.ts";

type Input = Array<number>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split(',').map(e => parseInt(e, 10));
}

solutions[0] = (memory: Input, run = false): number =>  {
	memory[1] = 12;
	memory[2] = 2;
  [...intcode({ inputs: [1], memory })];

	return memory[0];
}

solutions[1] = (memory: Input, run = false): number =>  {
	for (let a = 0; a < 100; a++) {
		for (let b = 0; b < 100; b++) {
			const memorycopy = [...memory];
			memorycopy[1] = a;
			memorycopy[2] = b;
			[...intcode({ inputs: [5], memory: memorycopy })];
			if (memorycopy[0] === 19690720) {
				return 100 * a + b;
			}
		}
	}

	return -1;
}