type Input = {
	fresh: Array<[number, number]>;
	available: Array<number>;
};

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  const [_fresh, _available] = rawInut.split(/\r?\n\r?\n/g);
	const fresh = _fresh.split(/\r?\n/g).map(line => {
		const [min, max] = line.split('-').map(e => parseInt(e, 10));
		return [min, max] as [number, number];
	});
	const available = _available.split(/\r?\n/g).map(line => parseInt(line, 10));
	return { fresh, available };
}

solutions[0] = ({ fresh, available }: Input, run = false): number => {
	let count = 0;
	for (const ingredient of available) {
		for (const [min, max] of fresh) {
			if (ingredient >= min && ingredient <= max) {
				count += 1;
				break;
			}
		}
	}
  return count;
}

solutions[1] = ({ fresh }: Input, run = false): number => {
	const ranges = fresh.toSorted((a, b) => a[0] - b[0]);
	const merged = [ranges[0]];
	for (let i = 0; i < ranges.length; i++) {
		const current = ranges[i];
		const last = merged[merged.length - 1];
		
		if (current[0] <= last[1]) {
			last[1] = Math.max(last[1], current[1]);
		} else {
			merged.push(current);
		}
	}

	let sum = 0;
	for (const [min, max] of merged) {
		sum += max - min + 1;
	}

	return sum;
}

const example = `3-5
10-14
16-20
12-18

1
5
8
11
17
32`;

export const runExamples = () => {
	for (let i = 0; i < solutions.length; i++) {
		console.log(`example[${i}]:`, solutions[i](parseInput(example), true))
	}
}