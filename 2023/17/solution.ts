import { PriorityQueue } from "./PriorityQueue.ts";

type Grid = Array<Array<number>>;
type Path = {
	x: number;
	y: number;
	dir: number;
	heatloss: number;
};
type Input = {
	grid: Grid;
	height: number;
	width: number;
};

export const parseInput = (rawInut: string): Input => {	
	const grid = rawInut
		.trim()
		.split(/\r?\n/g)
		.map(line => line.split('').map(Number));
	const height = grid.length;
	const width = grid[0].length;

	return {
		grid,
		height,
		width,
	}
}

const range = (start: number, end: number, step = 1) => {
  return Array.from({ length: Math.ceil((end - start) / step) }, (_, i) => i * step + start);
};

const solution = (input: Input, minStraight: number, maxStraight: number) => {
	const visited = new Set<number>();
	const paths = new PriorityQueue<Path>(
		[2, 3].map(dir => ({ x: 0, y: 0, dir, heatloss: 0 })),
		(a, b) => a.heatloss - b.heatloss,
	);

	const nextBlocks = (x: number, y: number, dir: number) => {
		return range(1, maxStraight + 1).map(b => {
			switch (dir) {
				case 0: return [x + b, y];
				case 1: return [x, y + b];
				case 2: return [x - b, y];
				case 3: return [x, y - b];
				default: throw new Error("NEXT BLOCK NOT FOUND!");
			}
		}).filter(([x, y]) => input.grid[y]?.[x])
	}

	const addNextBlocks = (
		x: number,
		y: number,
		dir: number,
		heatloss: number,
	) => {
		const blocks = nextBlocks(x, y, dir)
	
		for (let i = 0; i < blocks.length; i++) {
			heatloss += input.grid[blocks[i][1]][blocks[i][0]];
			i + 1 >= minStraight && paths.add({ x: blocks[i][0], y: blocks[i][1], dir, heatloss });
		}
	}
	
	while (true) {
		const path = paths.remove()!;
		if (!visited.has(2 * (path.y * input.width + path.x) + (path.dir % 2))) {
			if (path.x === input.width - 1 && path.y === input.height - 1) {
				return path.heatloss
			} else {
				visited.add(2 * (path.y * input.width + path.x) + (path.dir % 2));
				addNextBlocks(path.x, path.y, (path.dir + 1) % 4, path.heatloss)
				addNextBlocks(path.x, path.y, (path.dir + 3) % 4, path.heatloss)
			}
		}
	}
}

export const solution1 = (input: Input): number =>  {
	return solution(input, 1, 3);
}

export const solution2 = (input: Input): number =>  {
	return solution(input, 4, 10);
}