type Dir = 'U' | 'D' | 'L' | 'R'
type Line = {
	dir: Dir;
	len: number;
}
type Input = Array<Line & { col: string }>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
	const regex = new RegExp(/^(?<dir>[UDLR]) (?<len>\d+) \(#(?<col>[0-9a-f]{6})\)$/)
  return rawInut.split(/\r?\n/g).map(line => {
		const parsed = regex.exec(line);
		if (!parsed || !parsed.groups) throw new Error(`COULD NOT PARSE LINE: ${parsed!.groups}`);
		
		return {
			dir: parsed.groups.dir as Dir,
			len: parseInt(parsed.groups.len),
			col: parsed.groups.col,
		};
	});
}

const getCorner = (current: [number, number], dir: Dir, len: number): [number, number] => {
	switch (dir) {
		case 'D': return [current[0], current[1] + len]
		case 'L': return [current[0] - len, current[1]]
		case 'R': return [current[0] + len, current[1]]
		case 'U': return [current[0], current[1] - len]
		default: throw new Error("INVALID DIRECTION");
	}
}

const createCorners = (path: Array<Line>): [Array<[number, number]>, number] => {
	const corners: Array<[number, number]> = [[0, 0]];
	let circumference = 0;

	for (let i = 0; i < path.length; i++) {
		corners.push(getCorner(corners.at(-1)!, path[i].dir, path[i].len))
		circumference += path[i].len;
	}

	return [corners, circumference]
}

const calculteArea = (corners: Array<[number, number]>) => {
	let sum = 0;

	for (let i = 0; i < corners.length - 1; i++) {
		sum += corners[i][0] * corners[i + 1][1] - corners[i][1] * corners[i + 1][0]
	}

	return Math.abs(sum) / 2;
}


solutions[0] = (input: Input): number =>  {
	const instructions: Array<Line> = input.map(e => ({ dir: e.dir, len: e.len }));
	const [corners, b] = createCorners(instructions);
	const A = calculteArea(corners);
	return A - (b / 2) + b + 1;
}

solutions[1] = (input: Input): number =>  {
	const dirs = 'RDLU';
	const instructions: Array<Line> = input.map(e => ({
		dir: dirs[parseInt(e.col.at(-1)!)] as Dir,
		len: parseInt(e.col.slice(0, -1), 16),
	}));
	const [corners, b] = createCorners(instructions);
	const A = calculteArea(corners);
	return A - (b / 2) + b + 1;
}