import { permutations } from './permutations.ts';
type Input = any;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split(',').map(e => parseInt(e, 10));
}

const solution = (_inputs: Array<number>, memory: Input, run = false): number =>  {
	let pointer = 0;

	const inputs: Array<number> = [..._inputs];
	const outputs: Array<number> = [];

	const get_index = (mode: number, index: number) => {
		switch (mode) {
			case 0: return memory[index]
			case 1: return index;
			default: throw new Error(`BAD MEMORY MODE: ${mode}`);
		}
	}

	loop: while (true) {
		const [a, b, c, d, e] = String(memory[pointer]).padStart(5, '0');
		const modes = [parseInt(c, 10), parseInt(b, 10), parseInt(a, 10)];
		const indexes = modes.map((mode, i) => get_index(mode, pointer + i + 1));
		const opcode = (d + e);

		if (modes[2] !== 0) throw new Error(`3RD PARAMETER IS NOT ZERO!`);
		
		switch (opcode) {
			case '01': // addition
				memory[indexes[2]] = memory[indexes[0]] + memory[indexes[1]];
				pointer += 4;
				break;
			case '02': // multiplication
				memory[indexes[2]] = memory[indexes[0]] * memory[indexes[1]];
				pointer += 4;
				break;
			case '03': // input
				if (inputs.length === 0) throw new Error(`NO INPUT FOUND`);
				memory[indexes[0]] = inputs.shift()!;
				pointer += 2;
				break;
			case '04': // output
				outputs.push(memory[indexes[0]]);
				pointer += 2;
				break;
			case '05': // jump-if-true
				pointer = memory[indexes[0]] !== 0 ? memory[indexes[1]] : pointer + 3;
				break;
			case '06': // jump-if-false
				pointer = memory[indexes[0]] === 0 ? memory[indexes[1]] : pointer + 3;
				break;
			case '07': // less-than
				memory[indexes[2]] = memory[indexes[0]] < memory[indexes[1]] ? 1 : 0;
				pointer += 4;
				break;
			case '08': // equal
				memory[indexes[2]] = memory[indexes[0]] === memory[indexes[1]] ? 1 : 0;
				pointer += 4;
				break;
			case '99':
				break loop;
			default:
				throw new Error(`UNKNOWN OPCODE: ${opcode}`);
		}
	}

  return outputs[outputs.length - 1];
}

solutions[0] = (memory: Input, run = false): number =>  {
	let max = 0;

	for (const permutation of permutations('01234')) {
		let output = 0;
		for (const i of permutation) {
			output = solution([+i, output], [...memory]);
		}

		max = Math.max(max, output);
	}

  return max;
}

solutions[1] = (memory: Input, run = false): number =>  {
  if (!run) return -1;
	let max = 0;

	for (const permutation of permutations('56789')) {
		let output = 0;
		for (const i of permutation) {
			output = solution([+i, output], [...memory]);
			console.log(output)
		}

		max = Math.max(max, output);
	}

  return max;
}

console.log(solutions[1](parseInput(
	'3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5'
), true));
console.log(solutions[1](parseInput(
	'3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10'
), true));