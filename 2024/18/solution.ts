import { Grid, Cell } from './Grid.ts';

type CellType = number;
type Input = Array<[number, number]>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
	return rawInut.split(/\r?\n/g).map(line => line.split(',').map(e => parseInt(e, 10)) as [number, number]);
}

const createFindShortestPath = (w: number, h: number, input: Input) => (MAX_TIME: number): Array<Cell<CellType>> | undefined => {
	const grid = new Grid<CellType>(w, h, () => Infinity);
	const start = grid.cell(0, 0)!;
	const end = grid.cell(w - 1, h - 1)!;

	start.dist = 0;
	for (let i = 0; i < input.length; i++) {
		const [x, y] = input[i];
		const cell = grid.cell(x, y);
		if (!cell) throw new Error(`no cell found at (x=${x}, y=${y})`);
		cell.type = i;
	}

	const visited = new Set();
	const parents = new Map<number, number>();
	const nodes = grid.filterCells(cell => cell.type >= MAX_TIME);

	while (nodes.length > 0) {
		nodes.sort((a, b) => a.dist - b.dist);
		const current = nodes.shift()!;

		if (current.index == end.index) break;
		if (current.dist === Infinity) return undefined;

		const neighbours = current.neighbours.filter(cell => cell.type >= MAX_TIME && !visited.has(cell.index));
		for (const neighbour of neighbours) {
			const dist = current.dist + 1;
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
	} while (current && current !== 0)

  return path.map(index => grid.cellByIndex(index)!);
}

solutions[0] = (input: Input, run = false): number => {
	const shortestPathFinder = createFindShortestPath(71, 71, input);
	return (shortestPathFinder(1024)?.length ?? 0) - 1;
}

solutions[1] = (input: Input, run = false): string | number => {
	const shortestPathFinder = createFindShortestPath(71, 71, input);

	const buildable = new Set();
	let min = 0;
	let max = input.length;
	do {
		const i = Math.floor((min + max) / 2);
		const res = shortestPathFinder(i);
		if (res !== undefined) {
			buildable.add(i);
			min = i;
		} else {
			max = i;
		}
		
	} while (Math.abs(min - max) > 1);

	return input[max - 1].join(',');
}