type Input = {
	grid: string;
	width: number;
	height: number;
	walls: Set<number>;
};

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
	const width = rawInut.search(/\r?\n/);
	const c = rawInut.search(/\r\n/) !== -1 ? 2 : 1;
	const height = (rawInut.length + c) / (width + c);
	const grid = rawInut.replace(/\r?\n/g, '');
	const walls = new Set<number>();

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (grid[y * width + x] === '#') walls.add(y * width + x);
		}
	}

	return { grid, width, height, walls };
}

const DIRECTIONS = [
	[+0, -1],
	[+1, +0],
	[+0, +1],
	[-1, +0],
] as const;

solutions[0] = ({ grid, width, height, walls }: Input, run = false): number => {
	const path = new Set();

	const willBeOutOfBounds = (dir: number, position: number) => {
		const x = position % width;
		const y = Math.floor(position / width);

		return (false
			|| (dir === 0 && y === 0)
			|| (dir === 1 && x === width - 1)
			|| (dir === 2 && y === height - 1)
			|| (dir === 3 && x === 0)
		)
	}

	let pos = grid.indexOf('^');
	let d = 0;
	
	while (true) {
		path.add(pos);
		if (willBeOutOfBounds(d, pos)) break;
		const [dx, dy] = DIRECTIONS[d];
		const next = pos + (width * dy) + (1 * dx);
		
		if (grid[next] === '#') {
			d = (d + 1) % 4;
		} else {
			pos = next;
		}
	};

	return path.size;
}

// const hasLoop = ({ width, height, walls }: Input, x: number, y: number, d: number) => {
// 	const hit = new Set();
//   let [dx, dy] = DIRECTIONS[d];

//   while (true) {
//     x += dx;
//     y += dy;

//     if (x < 0 || y < 0 || y >= height || x >= width) {
//       return false;
//     }

//     if (walls.has(iden(x, y))) {
//       const pid = iden(x, y, d);
//       if (hit.has(pid)) {
//         return true;
//       }
//       hit.add(pid);
//       x -= dx;
//       y -= dy;
//       d = (d + 1) % DIRECTIONS.length;
//       [dx, dy] = DIRECTIONS[d];
//     }
//   }
// }

solutions[1] = ({ grid, width, height, walls }: Input, run = false): number => {
	if (!run) return 0;
	return -1;
}

const example = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;

console.log('result:', solutions[0](parseInput(example), true));