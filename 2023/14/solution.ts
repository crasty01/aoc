type Input = Array<Array<string>>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split(/\r?\n/g).map(line => line.split(''));
}

solutions[0] = (input: Input): number =>  {
	let sum = 0;
	const rows = Array.from({ length: input.length }, () => 0);

	for (let x = 0; x < input.length; x++) {
		let pointer = 0;

		for (let y = 0; y < input[x].length; y++) {
			const type = input[y][x];
			switch (type) {
				case 'O':
					rows[pointer] += 1;
					pointer += 1;
					break;
				case '#':
					pointer = y + 1;
					break;
				case '.': break;
				default: throw new Error(`UNKNOWN TYPE '${type}'`);
			}
		}
	}

	for (let i = 0; i < rows.length; i++) {
		sum += (rows.length - i) * rows[i];
	}

  return sum;
}

const cycle = (input: Input): Input => {
	// TILT NORTH
	for (let x = 0; x < input.length; x++) {
		let pointer = 0;

		for (let y = 0; y < input[x].length; y += 1) {
			const type = input[y][x];
			switch (type) {
				case 'O':
					input[y][x] = '.';
					input[pointer][x] = 'O';
					pointer += 1;
					break;
				case '#':
					pointer = y + 1;
					break;
				case '.': break;
				default: throw new Error(`UNKNOWN TYPE '${type}'`);
			}
		}
	}

	// TILT WEST
	for (let y = 0; y < input[0].length; y++) {
		let pointer = 0;

		for (let x = 0; x < input.length; x++) {
			const type = input[y][x];
			switch (type) {
				case 'O':
					input[y][x] = '.';
					input[y][pointer] = 'O';
					pointer += 1;
					break;
				case '#':
					pointer = x + 1;
					break;
				case '.': break;
				default: throw new Error(`UNKNOWN TYPE '${type}'`);
			}
		}
	}

	// TILT SOUTH
	for (let x = 0; x < input.length; x++) {
		let pointer = input.length - 1;

		for (let y = input[x].length - 1; y >= 0; y--) {
			const type = input[y][x];
			switch (type) {
				case 'O':
					input[y][x] = '.';
					input[pointer][x] = 'O';
					pointer += -1;
					break;
				case '#':
					pointer = y - 1;
					break;
				case '.': break;
				default: throw new Error(`UNKNOWN TYPE '${type}'`);
			}
		}
	}

	// TILT EAST
	for (let y = 0; y < input[0].length; y++) {
		let pointer = input[0].length - 1;

		for (let x = input.length - 1; x >= 0; x--) {
			const type = input[y][x];
			switch (type) {
				case 'O':
					input[y][x] = '.';
					input[y][pointer] = 'O';
					pointer += -1;
					break;
				case '#':
					pointer = x - 1;
					break;
				case '.': break;
				default: throw new Error(`UNKNOWN TYPE '${type}'`);
			}
		}
	}
	return input;
}

solutions[1] = (_input: Input): number =>  {
	const totalCycles = 1_000_000_000;
	const cache = new Map<string, number>();

	let sum = 0;
	let input = JSON.parse(JSON.stringify(_input)) as Input;

	for (let i = 0; i < totalCycles; i++) {
		const key = input.map(e => e.join('')).join('\n');
		if (cache.has(key)) {
			const match = cache.get(key)!;
			const cycleIndexToUse = match + ((totalCycles - match) % (i - match));
			const cycleToUse = [...cache.entries()].find(([_, index]) => index === cycleIndexToUse)![0]!;
			input = parseInput(cycleToUse);
			break;
		}
		
		cache.set(key, i);
		input = cycle(input);
	}

	for (let y = 0; y < input.length; y++) {
		for (let x = 0; x < input[y].length; x++) {
			if (input[y][x] === 'O') sum += input.length - y;
		}
	}

  return sum;
}