type Input = [Array<number>, Array<number>];

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  const lines = rawInut.split(/\r?\n/g).map(line => line.split('   ').map(e => parseInt(e, 10)));
	const a = Array.from({ length: lines.length }, (_, i) => lines[i][0]);
	const b = Array.from({ length: lines.length }, (_, i) => lines[i][1]);

	return [a, b]
}

solutions[0] = ([a, b]: Input, run = false): number =>  {
	const sortedA = a.toSorted((x, y) => x - y);
	const sortedB = b.toSorted((x, y) => x - y);

	let sum = 0;
	for (let i = 0; i < sortedA.length; i++) {
		sum += Math.abs(sortedA[i] - sortedB[i]);
	}

  return sum;
}

solutions[1] = ([a, b]: Input, run = false): number =>  {
	const bMap = new Map<number, number>();
	for (const e of b) {
		bMap.set(e, (bMap.get(e) ?? 0) + 1)
	}

	let sum = 0;
	for (const e of a) {
		sum += e * (bMap.get(e) ?? 0);
	}

  return sum;
}

const example = `3   4
4   3
2   5
1   3
3   9
3   3`;

console.log(solutions[1](parseInput(example), true));