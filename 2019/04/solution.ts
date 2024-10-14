type Input = [number, number];

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split(/-/g).map(e => parseInt(e, 10)) as Input;
}

solutions[0] = ([min, max]: Input, run = false): number =>  {
	let counter = 0;

	const isValidPassword = (n: number) => {
		const digits = String(n).split('').map(Number);
	
		for (let i = 0; i < digits.length - 1; i++) {
			if (digits[i] > digits[i + 1]) {
				return false;
			}
		}
	
		let hasAdjacent = false;
		for (let i = 0; i < digits.length - 1; i++) {
			if (digits[i] === digits[i + 1]) {
				hasAdjacent = true;
				break;
			}
		}
	
		return hasAdjacent;
	}

	for (let i = min; i <= max; i++) {
		counter += +isValidPassword(i);
	}
	return counter;
}

solutions[1] = ([min, max]: Input, run = false): number =>  {
	let counter = 0;

	const isValidPassword = (n: number) => {
		const digits = String(n).split('').map(Number);

		for (let i = 0; i < digits.length - 1; i++) {
			if (digits[i] > digits[i + 1]) {
				return false;
			}
		}

		let hasExactDouble = false;
		let count = 1;

		for (let i = 0; i < digits.length; i++) {
			if (digits[i] === digits[i + 1]) {
				count++;
			} else {
				if (count === 2) {
					hasExactDouble = true;
				}
				count = 1;
			}
		}

		return hasExactDouble;
	}

	for (let i = min; i <= max; i++) {
		counter += +isValidPassword(i);
	}
	return counter;
}