type Input = Array<number>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.trim().split(/\W+/g).map(e => parseInt(e, 10));
}

const createRecursive = (cache: Map<string, number>) => {
	const recursive = (n: number, depth: number): number => {
		if (depth === 0) return 1;
	
		const key = `${n}^${depth}`;
		if (cache.has(key)) return cache.get(key)!;
	
		const length = Math.max(Math.floor(Math.log10(Math.abs(n))), 0) + 1;;
		let res: number;

		if (n === 0) {
			res = recursive(1, depth - 1);
		} else if (length % 2 === 0) {
			const a = recursive(Math.floor(n / (10 ** (length >> 1))), depth - 1);
			const b = recursive(n % (10 ** (length >> 1)), depth - 1);
			res = a + b;
		} else {
			res = recursive(n * 2024, depth - 1);
		}
		cache.set(key, res);
		return res;
	}

	return recursive;
}

const solutionAdvanced = (input: Input, depth: number) => {
	const cache = new Map<string, number>();
	const recusive = createRecursive(cache);
	let sum = 0;
	
	for (const n of input) {
		sum += recusive(n, depth);
	}

	return sum;
}

solutions[0] = (input: Input, run = false): number => {
	return solutionAdvanced(input, 25);
}

solutions[1] = (input: Input, run = false): number => {
	return solutionAdvanced(input, 75);
}