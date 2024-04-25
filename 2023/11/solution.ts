type Galaxy = {
	x: number;
	y: number;
}
type Input = {
	content: string,
	width: number,
	height: number,
	galaxies: Array<Galaxy>
	blanks: {
		x: Array<number>;
		y: Array<number>;
	},
};

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
	const content = rawInut.replace(/\r?\n/g, '');
	const width = rawInut.replace('\r\n', '\n').indexOf('\n');
	const height = content.length / width;
	const galaxies: Array<Galaxy> = [];
	const blanks = {
		x: Array.from({ length: width }, () => true),
		y: Array.from({ length: height }, () => true),
	}
	for (let i = 0; i < content.length; i++) {
		if (content[i] !== '#') continue;
		galaxies.push({
			x: i % width,
			y: Math.floor(i / width),
		});
		blanks.x[i % width] = false;
		blanks.y[Math.floor(i / width)] = false;
	}

  return {
		content,
		width,
		height,
		blanks: {
			x: [...blanks.x.entries()].filter(e => e[1]).map(e => e[0]),
			y: [...blanks.y.entries()].filter(e => e[1]).map(e => e[0]),
		},
		galaxies,
	};
}

const solution = (input: Input, expansion: number): number =>  {
	let sum = 0;

	for (let i = 0; i < input.galaxies.length - 1; i++) {
		for (let j = i + 1; j < input.galaxies.length; j++) {
			const a = input.galaxies[i];
			const b = input.galaxies[j];

			const blankX = input.blanks.x.filter(e => a.x > b.x
				? e > b.x && e < a.x
				: e > a.x && e < b.x
			).length;
			const blankY = input.blanks.y.filter(e => a.y > b.y
				? e >= b.y && e <= a.y
				: e >= a.y && e <= b.y
			).length;

			const baseDistance = Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
			const blankDistance = (blankX + blankY) * (expansion - 1);
			sum += baseDistance + blankDistance;
		}
	}

  return sum;
}

solutions[0] = (input: Input): number =>  {
  return solution(input, 2);
}

solutions[1] = (input: Input, run = false): number =>  {
	return solution(input, 1_000_000);
}