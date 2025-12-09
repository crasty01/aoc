type Input = Array<Array<string>>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split(/\r?\n/g).map(line => line.split(''));
}

solutions[0] = (input: Input, run = false): number => {
  // if (!run) return -1;
	let counter = 0;
	let active: Array<number> = Array.from({ length: input[0].length }, () => 0);
	const S = (active.length - 1) / 2;
	if (!Number.isInteger(S) || input[0][S] !== 'S') {
		console.log({ S, active, input })
		throw new Error("INVALID START");
	}
	
	active[S] = 1;

	for (let i = 1; i < input.length; i++) {
		const line = input[i];
		const future: Array<number> = active.map(() => 0);
		for (let j = 0; j < line.length; j++) {
			if (active[j] === 0) continue;
			const cell = line[j];
			if (cell === '^') {
				counter += 1;
				future[j - 1] = active[j];
				future[j + 1] = active[j];
			} else {
				future[j] = active[j];
			}
		}

		active = future;
	}

  return counter;
}

solutions[1] = (input: Input, run = false): number => {
	let active: Array<number> = Array.from({ length: input[0].length }, () => 0);
	const S = (active.length - 1) / 2;
	if (!Number.isInteger(S) || input[0][S] !== 'S') {
		console.log({ S, active, input })
		throw new Error("INVALID START");
	}
	
	active[S] = 1;

	for (let i = 1; i < input.length; i++) {
		const line = input[i];
		const future: Array<number> = active.map(() => 0);
		for (let j = 0; j < line.length; j++) {
			if (active[j] === 0) continue;
			const cell = line[j];
			if (cell === '^') {
				future[j - 1] += active[j];
				future[j + 1] += active[j];
			} else {
				future[j] += active[j];
			}
		}

		active = future;
	}

	let sum = 0
	for (let i = 0; i < active.length; i++) {
		sum += active[i];
	}

  return sum;
}

const example = `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`;

export const runExamples = () => {
	for (let i = 0; i < solutions.length; i++) {
		console.log(`example[${i}]:`, solutions[i](parseInput(example), true))
	}
}