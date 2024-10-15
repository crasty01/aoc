import { intcode } from "/2019/intcode.ts";
import { permutations } from './permutations.ts';
type Input = Array<number>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split(',').map(e => parseInt(e, 10));
}

solutions[0] = (memory: Input, run = false): number =>  {
	let max = 0;

	for (const permutation of permutations('01234')) {
		let output = 0;
		for (const i of permutation) {
			output = [...intcode({
				inputs: [+i, output],
				memory: [...memory],
				pointer: 0,
			})].at(-1)!;
		}

		max = Math.max(max, output);
	}

  return max;
}

solutions[1] = (memory: Input, run = false): number =>  {
	let max = 0;

	for (const permutation of permutations('56789')) {
		let amplifierIndex = 0;
		let output = 0;
		let n = 0;
		const amplifiers = Array.from({ length: permutation.length }, (_, i) => {
			const inputs: Array<number> = [+permutation[i]];
			return {
				inputs,
				done: false,
				amplifier: intcode({
					inputs: inputs,
					memory: [...memory],
					pointer: 0,
				})
			}
		});

		while (true) {
			amplifiers[amplifierIndex].inputs.push(output);
			const { value, done } = amplifiers[amplifierIndex].amplifier.next();
			if (done) {
				amplifiers[amplifierIndex].done = true;
			} else {
				output = value;
			}
			amplifierIndex = (amplifierIndex + 1) % permutation.length;

			if (amplifiers.every(e => e.done)) break;
			n += 1;
		}

		max = Math.max(max, output);
	}

  return max;
}