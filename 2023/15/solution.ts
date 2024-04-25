type Input = string;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut;
}

const encode = (string: string) => {
	let hash = 0
	for (let i = 0; i < string.length; i++) {
		hash = ((hash + string.charCodeAt(i)) * 17 % 256)
	}

  return hash;
}

solutions[0] = (input: Input): number =>  {
	let sum = 0;
	let current = '';
	for (let i = 0; i <= input.length; i++) {
		if (input[i] === ',' || !input[i]) {
			sum += encode(current);
			current = '';
		} else {
			current += input[i]
		}
	}

  return sum;
}

solutions[1] = (input: Input): number =>  {
	let sum = 0;
	const instructions = input.split(',');
	const map = Array.from({ length: 256 }, () => [] as Array<[string, number]>);

	for (const instruction of instructions) {
		const parsed = /^(?<label>\w+)(?<operation>=|-)(?<value>\d)?$/g.exec(instruction);

		if (!parsed) throw new Error(`COULD NOT PARSE INSTRUCTION: '${instruction}'`);

		const label = parsed.groups!.label;
		const operation = parsed.groups!.operation as '=' | '-';
		const value = parsed.groups!.value ? parseInt(parsed.groups!.value) : undefined;

		const hash = encode(label);

		if (operation === '=') {
			let index = map[hash].findIndex(([l, _]) => l === label);
			index = index === -1 ? map[hash].length : index;
			map[hash][index] = [label, value!];
		} else {
			map[hash] = map[hash].filter(([l, _]) => l !== label);
		}
	}

	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[i].length; j++) {
			sum += (i + 1) * (j + 1) * map[i][j][1];
		}
	}

  return sum;
}