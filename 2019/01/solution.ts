type Input = Array<number>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split(/\r?\n/g).map(e => parseInt(e, 10));
}

solutions[0] = (input: Input, run = false): number =>  {
	let sum = 0;
	for (const mass of input) {
		sum += Math.floor(mass / 3) - 2;
	}
  return sum;
}

solutions[1] = (input: Input, run = false): number =>  {
	let sum = 0;
	for (const _mass of input) {
		let mass = _mass;
		do {
			mass = Math.floor(mass / 3) - 2;
			sum += mass;
		} while (mass > 6)
	}
  return sum;
}