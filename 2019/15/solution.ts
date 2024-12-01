import { intcode, PartialContext } from '/2019/intcode.ts';
type Input = Array<number>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split(',').map(e => parseInt(e, 10));
}

solutions[0] = (memory: Input, run = false): number =>  {
	const ctx: PartialContext = {
		memory,
		inputs: [],
	};
	const robot = intcode(ctx);
	const DIRECTIONS = {
		'up': 1,
		'down': 2,
		'left': 3,
		'right': 4,
	} as const;
	type Directions = keyof typeof DIRECTIONS;
	const getPosition = (x: number, y: number, dir: number) => {
		switch (dir) {
			case 1: return [x, y + 1];
			case 2: return [x, y - 1];
			case 3: return [x - 1, y];
			case 4: return [x + 1, y];
			default: throw new Error(`getPosition, ${dir}`);
		}
	}

	const step = (dir: number) => {
		ctx.inputs.push(dir);
		const value = robot.next().value;

		if (value === undefined) throw new Error("step, ???");
		return value;
	}


	const walls = new Set<string>();
	const visited = new Set<string>(['0,0']);
	let x = 0;
	let y = 0;
	let dir = 0;
	loop: while (true) {
		visited.add(`${x},${y}`);
		
		const [nx, ny] = getPosition(x, y, dir + 1);
		const v = step(dir + 1);
		switch (v) {
			case 0:
				walls.add(`${nx},${ny}`);
				dir = (dir + 1) % 4;
				break loop;
			case 1:
				x = nx;
				y = ny;
				break;
			case 2: throw new Error("loop, ???");
			default: throw new Error("loop, ???");
		}
	}
	
	// now I'm on valid spot, and have a wall on my left
	/*
	| |X| |
	-------
	| |>| |
	-------
	| | | |
	*/

	let dirs = [1, 4, 2, 3];
	let minX = x;
	let minY = y;
	let maxX = x;
	let maxY = y;
	let n = 0;
	while (n < 100000) {
		n += 1;
		visited.add(`${x},${y}`);
		minX = Math.min(minX, x - 1);
		minY = Math.min(minY, y - 1);
		maxX = Math.max(maxX, x + 1);
		maxY = Math.max(maxY, y + 1);
		const aheadPos = getPosition(x, y, dirs[dir]);
		// console.log(`n=${n} dir=${dir} x=${y} y=${y} => x=${aheadPos[0]} y=${aheadPos[1]}`);
		const ahead = step(dirs[dir]);
		if (ahead === 2) {
			[x, y] = aheadPos;
			break;
		}
		if (ahead === 0) {
			dir = (dir + 1) % 4;
			walls.add(`${aheadPos[0]},${aheadPos[1]}`);
			continue;
		}
		if (ahead === 1) {
			[x, y] = aheadPos;
		}
		
		const leftDir = (dir + 3) % 4;
		const leftPos = getPosition(x, y, dirs[leftDir]);
		const left = step(dirs[leftDir]);
		if (left === 2) {
			[x, y] = leftPos;
			break;
		}
		if (left === 1) {
			[x, y] = leftPos;
			dir = leftDir;
		}
		if (left === 0) {
			walls.add(`${leftPos[0]},${leftPos[1]}`);
		}
	}

	const end = [x, y];
	console.log({minX, maxX, minY, maxY})
	
	for (let y = minY; y <= maxY; y++) {
		let row = '';
		for (let x = minX; x <= maxX; x++) {
			const key = `${x},${y}`;
			if (x === 0 && y === 0) {
				row += '🚩';
			} else if (x === end[0] && y === end[1]) {
				row += '🏁';
			} else if (walls.has(key)) {
				row += '⬛';
			} else if (visited.has(key)) {
				row += '⬜';
			} else {
				row += '🟥';
			}
		}
		console.log(row);
	}

  return 0;
}

solutions[1] = (input: Input, run = false): number =>  {
  if (!run) return -1;
  return 0;
}