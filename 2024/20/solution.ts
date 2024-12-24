import { Grid } from './Grid.ts';

type CellType = '.' | '#' | 'S' | 'E';
type Input = Grid<CellType>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
	const w = rawInut.search(/\r?\n/);
	const c = rawInut.search(/\r\n/) !== -1 ? 2 : 1;
	const h = (rawInut.length + c) / (w + c);
	return new Grid<CellType>(w, h, (x, y) => rawInut[y * (w + c) + x] as CellType);
}

solutions[0] = (grid: Input, run = false): number =>  {
	const start = grid.findCell(cell => cell.type === 'S')!;
	const end = grid.findCell(cell => cell.type === 'E')!;
	const skips = new Map<number, number>();
	
	start.dist = 0;
	let current = start;

	while (true) {
		for (const neighbour of current.neighbours) {
			if (neighbour.type !== '#') continue;
			const n = grid.cell(
				current.x + (neighbour.x - current.x) * 2,
				current.y + (neighbour.y - current.y) * 2,
			);
			if (!n || n.type === '#' || n.dist === Infinity) continue;
			const save = current.dist - n.dist - 2;
			skips.set(save, (skips.get(save) ?? 0) + 1)
		}

		if (current === end) break;

		const [next] = current.neighbours.filter(cell => cell.type !== '#' && cell.dist === Infinity);
		next.dist = current.dist + 1;
		current = next;
	}

	let sum = 0;
	for (const [key, value] of skips) {
		if (key >= 100) sum += value;
	}

  return sum;
}

solutions[1] = (input: Input, run = false): number =>  {
  if (!run) return -1;
  return 0;
}

const example = `###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`;

console.log('result:', solutions[0](parseInput(example), true));