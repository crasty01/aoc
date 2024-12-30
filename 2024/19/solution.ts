type Input = {
	designs: Array<string>;
	patterns: Array<string>;
};

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  const [d, p] = rawInut.split(/\r?\n\r?\n/g);

	return {
		designs: d.split(', ').sort((a, b) => b.length - a.length),
		patterns: p.split(/\r?\n/g),
	}
}

const createPatternChecker = (designs: Array<string>, memo: Map<string, number>) => {
	const patternChecker = (input: string): number => {
    if (memo.has(input)) return memo.get(input)!;
		
		let count = 0;
		for (const design of designs) {
			if (!input.startsWith(design)) continue;
			count += patternChecker(input.slice(design.length));
		}
		memo.set(input, count);

		return count;
	}

	return patternChecker;
}

solutions[0] = ({ designs, patterns }: Input, run = false): number => {
	const memo = new Map<string, number>([["", 1]]);
	const patternChecker = createPatternChecker(designs, memo);

	let possible = 0;
	for (const pattern of patterns) {
		possible += Math.sign(patternChecker(pattern));
	}

  return possible;
}

solutions[1] = ({ designs, patterns }: Input, run = false): number => {
	const memo = new Map<string, number>([["", 1]]);
	const patternChecker = createPatternChecker(designs, memo);

	let possible = 0;
	for (const pattern of patterns) {
		possible += patternChecker(pattern);
	}

  return possible;
}

const example = `r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`;

console.log('result:', solutions[1](parseInput(example), true));