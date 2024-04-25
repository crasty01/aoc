type Input = Array<Array<number>>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split(/\r?\n/).map(line => {
		return line.split(' ').map(e => parseInt(e, 10));
	});
}

solutions[0] = (input: Input): number =>  {
	let sum = 0;
	for (const line of input) {
		const differences: Array<Array<number>> = [[...line]];
		let foundFullHistory = false;

		while (!foundFullHistory) {
			const last = differences.at(-1)!;
			const current = [];
			let found = true;
			for (let i = 0; i < last.length - 1; i += 1) {
				const diff = last[i + 1] - last[i];
				current.push(diff);
				if (diff !== 0) found = false;
			}
			differences.push(current);
			if (found) foundFullHistory = true;
		}

		let value = 0;
		for (let i = differences.length - 1; i >= 0; i += -1) {
			value = differences[i].at(-1)! + value
		}
		
		sum += value;
	}

  return sum;
}

solutions[1] = (input: Input): number =>  {
	let sum = 0;
	for (const line of input) {
		const differences: Array<Array<number>> = [[...line]];
		let foundFullHistory = false;

		while (!foundFullHistory) {
			const last = differences.at(-1)!;
			const current = [];
			let found = true;
			for (let i = 0; i < last.length - 1; i += 1) {
				const diff = last[i + 1] - last[i];
				current.push(diff);
				if (diff !== 0) found = false;
			}
			differences.push(current);
			if (found) foundFullHistory = true;
		}

		let value = 0;
		for (let i = differences.length - 1; i >= 0; i += -1) {
			value = differences[i].at(0)! - value;
		}
		
		sum += value;
	}

  return sum;
}