type Game = Array<[number, number, number]>; // R, G, B
type Input = Array<Game>;

const colors = ['red', 'green', 'blue'] as const;
const maxes = [12, 13, 14] as const;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split('\r\n').map(line => {
		const [_, sets_raw] = line.split(': ');
		const sets = sets_raw.split('; ')
		return sets.map(set => {
			const items = set.split(', ')
			const obj = Object.fromEntries(items.map(i => {
				const [n, color] = i.split(' ');
				return [colors.indexOf(color as typeof colors[number]), parseInt(n)];
			}));

			return [obj[0] ?? 0, obj[1] ?? 0, obj[2] ?? 0];
		})
	});
}

solutions[0] = (input: Input): number | string => {
	let sum = 0;
	
	for (let i = 0; i < input.length; i++) {
		let validGame = true;
		for (const set of input[i]) {
			const found = set.findIndex((n, i) => n > maxes[i]) !== -1;
			if (found) {
				validGame = false;
			}
		}
		if (validGame) sum += i + 1;
	}

	return sum;
}

solutions[1] = (input: Input): number | string => {
	let sum = 0;
	
	for (let i = 0; i < input.length; i++) {
		const max = [0, 0, 0]
		for (const set of input[i]) {
			for (let j = 0; j < set.length; j++) {
				if (max[j] < set[j]) max[j] = set[j]
			}
		}
		sum += max[0] * max[1] * max[2]
	}

	return sum;
}