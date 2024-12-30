type Input = string;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.trim();
}

solutions[0] = (input: Input, run = false): number => {
	const disk: Array<number | undefined> = [];
	for (let i = 0; i < input.length; i++) {
		const n = +input[i];
		const v = i % 2 === 0 ? i / 2 : undefined;

		for (let j = 0; j < n; j++) {
			disk.push(v)
		}
	}

	const compacted: Array<number> = [];
	let pr = disk.length - 1;
	for (let i = 0; i < disk.length; i++) {
		if (pr < i) break;
		if (disk[i] !== undefined) {
			compacted[i] = disk[i]!;
		} else {
			while (disk[pr] === undefined) pr += -1;
			compacted[i] = disk[pr]!;
			pr += -1;
		}
	}


	let checksum = 0;
	for (let i = 0; i < compacted.length; i++) {
		checksum += i * compacted[i];
	}

	return checksum;
}

solutions[1] = (input: Input, run = false): number => {
  if (!run) return -1;
  return 0;
}

const example = `2333133121414131402`;
// const example = '12345';

console.log('result:', solutions[0](parseInput(example), true));