type Input = Array<Array<number>>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split(/\r?\n/).map(line => line.split(' ').map(Number));
}

const isValid = (line: Array<number>) => {
	const dir = Math.sign(line[0] - line[1]);

	for (let i = 1; i < line.length; i++) {
		const diff = line[i - 1] - line[i];

		if (Math.sign(diff) !== dir || Math.abs(diff) > 3 || Math.abs(diff) < 1) {
			return false;
		}
	}

	return true;
}

solutions[0] = (input: Input, run = false): number => {
	let safe = 0;

	for (const line of input) {
		safe += +isValid(line);
	}

  return safe;
}

solutions[1] = (input: Input, run = false): number => {
  let safe = 0;

	for (const line of input) {
		const possibilities = [
			line,
			...Array.from(
				{ length: line.length },
				(_, i) => line.filter((_, fi) => fi !== i)
			),
		];
		safe += +possibilities.some(e => isValid(e));
	}

  return safe;
}