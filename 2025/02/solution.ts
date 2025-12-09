type Input = Array<[number, number]>;

export const solutions: Array<
  (input: Input, run?: boolean) => number | string
> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split(",").map((line) => {
    const pair = line.split("-");
    if (pair.length !== 2) throw new Error("BAD INPUT");
    return pair.map((e) => parseInt(e, 10)) as [number, number];
  });
};

const cache = new Map<number, RegExp>();

const slice = (input: string, numberOfSlices: number): Array<string> | null => {
	if (!cache.has(numberOfSlices)) {
		cache.set(numberOfSlices , new RegExp(`\\d{${numberOfSlices}}`, 'g'));
	}
	const regexp = cache.get(numberOfSlices)!;
	const slices = input.match(regexp);
	return slices;
}

const validate = (slices: Array<string> | null) => {
	if (!slices) return false;

	for (let i = 1; i < slices.length; i++) {
		if (slices[0] !== slices[i]) {
			return false;
		}
	}

	return true;
};

solutions[0] = (input: Input, run = false): number => {
  let sum = 0;
  for (const [min, max] of input) {
    let current = min;

    for (let i = min; i <= max; i++) {
			const s = current.toString();
			const slices = slice(s, s.length / 2);
			if (validate(slices)) {
				sum += current;
			}

      current += 1;
    }
  }
  return sum;
};

solutions[1] = (input: Input, run = false): number => {
  let sum = 0;
  for (const [min, max] of input) {
    let current = min;

    for (let i = min; i <= max; i++) {
			const s = current.toString();
			let isValid = false;

			for (let j = 2; j <= s.length; j++) {
				const slices = slice(s, s.length / j);
				if (validate(slices)) {
					isValid = true;
				}
			}

			if (isValid) {
				sum += current;
			}

      current += 1;
    }
  }
  return sum;
};