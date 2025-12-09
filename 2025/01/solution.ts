type Line = ['L' | 'R', number]
type Input = Array<Line>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split(/\r?\n/g).map(line => {
		const dir = line.slice(0, 1);
		const rotation = parseInt(line.slice(1));
		if (dir !== 'L' && dir !== 'R') throw new Error(`invalid direction symbol: '${dir}'`);
		return [dir, rotation];
	});
}

const mod = (a: number, b: number) => ((a % b) + b) % b;

solutions[0] = (input: Input, run = false): number => {
	const max = 100;
	let pointer = 50;
	let counter = 0;
	for (const [dir, rotation] of input) {
		switch (dir) {
			case 'L':
				pointer = pointer - rotation;
				break;
			case 'R':
				pointer = pointer + rotation;
				break;
			default: throw new Error("UNREACHABLE");
		}
		pointer = mod(pointer, max);
		if (pointer === 0) counter += 1;
	}
  return counter;
}

solutions[1] = (input: Input, run = false): number => {
	const max = 100;
	let pointer = 50;
	let counter = 0;
	for (const [dir, rotation] of input) {
		const p = pointer;
		const r = mod(rotation, max);
		counter += Math.floor(rotation / max);
		switch (dir) {
			case 'L':
				pointer = pointer - r;
				if (pointer <= 0 && p !== 0) counter += 1;
				break;
			case 'R':
				pointer = pointer + r;
				if (pointer >= max) counter += 1;
				break;
			default: throw new Error("UNREACHABLE");
		}
		pointer = mod(pointer, max);
	}
  return counter;
}
