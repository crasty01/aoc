import { Grid, Cell } from './Grid.ts';

type CellType = '#' | '.' | 'S' | 'E';
type Input = Grid<CellType>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
	const w = rawInut.search(/\r?\n/);
	const c = rawInut.search(/\r\n/) !== -1 ? 2 : 1;
	const h = (rawInut.length + c) / (w + c);

  return new Grid<CellType>(w, h, (x, y) => rawInut[y * (w + c) + x] as CellType);
}

const getDirection = (a: Cell<CellType>, b: Cell<CellType>) => {
	return (b.x - a.x) * 3 + (b.y - a.y);
}

const findShortestPath = (grid: Input): Array<Cell<CellType>> | undefined => {
	const start = grid.findCell(cell => cell.type === 'S')!;
	const end = grid.findCell(cell => cell.type === 'E')!;
	start.dist = 0;

	const visited = new Set();
	const parents = new Map<number, number>();
	const nodes = grid.filterCells(cell => cell.type !== '#');

	while (nodes.length > 0) {
		nodes.sort((a, b) => a.dist - b.dist);
		const current = nodes.shift()!;

		if (current.index == end.index) break;
		if (current.dist === Infinity) return undefined;

		const parent = grid.cellByIndex(parents.get(current.index) ?? start.index - 1)!;
		const dir = getDirection(parent, current);
		if (current === start) console.log(dir)
		const neighbours = current.neighbours.filter(cell => cell.type !== '#' && !visited.has(cell.index));
		for (const neighbour of neighbours) {
			const newDir = getDirection(current, neighbour);
			const dist = current.dist + (dir !== 0 && dir !== newDir ? 1001 : 1);
			if (dist < neighbour.dist) {
				neighbour.dist = dist;
				parents.set(neighbour.index, current.index);
			}
		}

		visited.add(current.index);
	}

	const path = [end.index];
	let current;
	do {
		current = parents.get(path.at(-1)!)!;
		path.push(current);
	} while (current && current !== start.index)

  return path.map(index => grid.cellByIndex(index)!);
}

solutions[0] = (input: Input, run = false): number => {
	const path = findShortestPath(input);
	if (!path) throw new Error("NO PATH FOUND");
	return path[0].dist;
}

solutions[1] = (input: Input, run = false): number => {
  if (!run) return -1;
  return 0;
}

const example = `#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`;

console.log('result:', solutions[0](parseInput(example), true));