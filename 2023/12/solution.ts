// inspired by https://github.com/hyper-neutrino/advent-of-code/blob/main/2023/day12p2.py

type Input = Array<{
	conditions: string;
	sizes: Array<number>;
}>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split(/\r?\n/g).map(line => {
		const [conditions, sizesData] = line.split(' ');
		const sizes = sizesData.split(',').map(e => parseInt(e, 10));

		return { conditions, sizes }
	})
};

const findArrangements = (
  conditions: string,
	sizes: Array<number>,
  cache = new Map<string, number>(),
): number => {
  const key = `${conditions}-${sizes}`;
  if (cache.has(key)) return cache.get(key)!;
  if (conditions === '') return sizes.length ? 0 : 1;
  if (sizes.length === 0) return conditions.includes('#') ? 0 : 1;

  let result = 0;

  const condition = conditions[0];
  if (condition === '.' || condition === '?') {
    result += findArrangements(conditions.slice(1), sizes, cache);
  }

  const first = sizes[0];
  const rest = sizes.slice(1);

	if (true
		&& (condition === '#' || condition === '?')
		&& first <= conditions.length
		&& !conditions.slice(0, first).includes('.')
		&& (first === conditions.length || conditions[first] !== '#')
	) {
		result += findArrangements(conditions.slice(first + 1), rest, cache);
	}

  cache.set(key, result);
  return result;
};

solutions[0] = (input: Input): number => {
	let sum = 0;

	for (const line of input) {
		sum += findArrangements(line.conditions, line.sizes);
	}

  return sum;
};

solutions[1] = (input: Input): number => {
	let sum = 0;

	for (const line of input) {
		const conditions = (line.conditions + '?').repeat(5).slice(0, -1);
		const sizes = Array.from({ length: line.sizes.length * 5 }, (_, i) => line.sizes[i % line.sizes.length]);
		sum += findArrangements(conditions, sizes);
	}

  return sum;
};