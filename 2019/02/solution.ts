type Input = Array<number>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split(',').map(e => parseInt(e, 10));
}

const runInstruction = (memory: Array<number>, a: number, b: number) => {
	memory[1] = a;
	memory[2] = b;

	let index = 0;
	loop: while (true) {
		switch (memory[index]) {
			case 1:
				memory[memory[index + 3]] = memory[memory[index + 1]] + memory[memory[index + 2]];
				index += 4;
				break;
			case 2:
				memory[memory[index + 3]] = memory[memory[index + 1]] * memory[memory[index + 2]];
				index += 4;
				break;
			case 99:
				break loop;
			default:
				throw new Error(`BAD OPCODE ENCOUNTERED ${memory[index]} AT ${index}`);
		}
	}

  return memory[0];
}

solutions[0] = (input: Input, run = false): number =>  {
	return runInstruction(input, 12, 2);	
}

solutions[1] = (input: Input, run = false): number =>  {
	for (let a = 0; a < 100; a++) {
		for (let b = 0; b < 100; b++) {
			if (runInstruction([...input], a, b) === 19690720) {
				return 100 * a + b;
			}
		}
	}

  return -1;
}