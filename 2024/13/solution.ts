type Input = Array<{
	a: [number, number];
	b: [number, number];
	p: [number, number];
}>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split(/\r?\n\r?\n/g).map((line) => {
		const [raw_a, raw_b, raw_p] = line.split(/\r?\n/g);

		const regex = /^.+: X=?\+?(?<x>-?\d+), Y=?\+?(?<y>-?\d+)/;
		const a = regex.exec(raw_a)?.groups;
		const b = regex.exec(raw_b)?.groups;
		const p = regex.exec(raw_p)?.groups;

		if (!a || !b || !p) throw new Error(`COULDN'T PARSE LINES: '${raw_a + ', ' + raw_b + ', ' + raw_p}'`);

		return {
			a: [parseInt(a.x, 10), parseInt(a.y, 10)],
			b: [parseInt(b.x, 10), parseInt(b.y, 10)],
			p: [parseInt(p.x, 10), parseInt(p.y, 10)],
		};
	});
}

solutions[0] = (input: Input, run = false): number => {
	let sum = 0;
	for (const {a, b, p} of input) {
		const determinant = a[0] * b[1] - b[0] * a[1];

		if (determinant === 0) continue;
	
		const x = (p[0] * b[1] - p[1] * b[0]) / determinant;
		const y = (a[0] * p[1] - a[1] * p[0]) / determinant;

		if (Math.floor(x) !== x || Math.floor(y) !== y) continue;

		sum += x * 3 + y;
	}
	
  return sum;
}

solutions[1] = (input: Input, run = false): number => {
	let sum = 0;
	for (const {a, b, p} of input) {
		const determinant = a[0] * b[1] - b[0] * a[1];

		if (determinant === 0) continue;
	
		const x = ((p[0] + 10000000000000) * b[1] - (p[1] + 10000000000000) * b[0]) / determinant;
		const y = (a[0] * (p[1] + 10000000000000) - a[1] * (p[0] + 10000000000000)) / determinant;

		if (Math.floor(x) !== x || Math.floor(y) !== y) continue;

		sum += x * 3 + y;
	}
	
  return sum;
}
