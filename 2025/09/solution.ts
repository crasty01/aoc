type Input = Array<[number, number]>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split(/\r?\n/g).map(line => {
		const [x, y] = line.split(',');
		if (!x || x.length === 0 || !y || y.length === 0) {
			throw new Error("BAD INPUT");
		}

		return [parseInt(x, 10), parseInt(y, 10)];
	});
}

solutions[0] = (input: Input, run = false): number => {
	let area = 0;
	
	for (let i = 0; i < input.length; i++) {
		const [ax, ay] = input[i];
		for (let j = i + 1; j < input.length; j++) {
			const [bx, by] = input[j];
			const x = Math.max(bx - ax, ax - bx);
			const y = Math.max(by - ay, ay - by);
			area = Math.max((x + 1) * (y + 1), area);
		}
	}

  return area;
}

solutions[1] = (input: Input, run = false): number => {
	let area = 0;
	const xLines = new Map<number, Array<[number, number]>>();
	const yLines = new Map<number, Array<[number, number]>>();

	for (let i = 0; i < input.length; i++) {
		const [ax, ay] = input[i];
		const [bx, by] = input[(i + 1) % input.length];
		if (ax === bx) {
			xLines.set(ax, [...xLines.get(ax) ?? [], [Math.min(ay, by), Math.max(ay, by)]]);
		} else if (ay === by) {
			yLines.set(ay, [...yLines.get(ay) ?? [], [Math.min(ax, bx), Math.max(ax, bx)]]);
		} else {
			throw new Error("BAD INPUT");
		}
	}

	const isValid = (_ax: number, _ay: number, _bx: number, _by: number): boolean => {
		const ax = Math.min(_ax, _bx);
		const ay = Math.min(_ay, _by);
		const bx = Math.max(_ax, _bx);
		const by = Math.max(_ay, _by);

		for (let x = ax + 1; x < bx; x++) {
			const xLineArray = xLines.get(x) ?? [];
			for (const [y1, y2] of xLineArray) {
				if ((y1 < by && y2 >= by) || (y1 <= ay && y2 > ay)) {
					return false;
				}
			}
		}

		for (let y = ay + 1; y < by; y++) {
			const yLineArray = yLines.get(y) ?? [];
			for (const [x1, x2] of yLineArray) {
				if ((x1 < bx && x2 >= bx) || (x1 <= ax && x2 > ax)) {
					return false;
				}
			}
		}

		return true;
	}

	for (let i = 0; i < input.length; i++) {
		const [ax, ay] = input[i];
		for (let j = i + 1; j < input.length; j++) {
			const [bx, by] = input[j];
			if (!isValid(ax, ay, bx, by)) continue;
			const x = Math.max(bx - ax, ax - bx);
			const y = Math.max(by - ay, ay - by);
			area = Math.max((x + 1) * (y + 1), area);
		}
	}

  return area;
}

const example = `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`;

for (let i = 0; i < solutions.length; i++) {
	console.log(`solution[${i}]:`, solutions[i](parseInput(example), true))
}