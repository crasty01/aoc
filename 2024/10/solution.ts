import { Grid, Cell } from './Grid.ts';

type CellType = number | '.';
type Input = Grid<CellType>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
	const w = rawInut.search(/\r?\n/);
	const c = rawInut.search(/\r\n/) !== -1 ? 2 : 1;
	const h = (rawInut.length + c) / (w + c);
  return new Grid<CellType>(w, h, (x, y) => {
		const v = rawInut[y * (w + c) + x];
		return v === '.' ? '.' : parseInt(rawInut[y * (w + c) + x], 10);
	});
}

const createTrailsGetter = (grid: Grid<CellType>, trailHead: Cell<CellType>) => {
	const trails: Array<Array<Cell<CellType>>> = [];
	const queue: Array<Array<Cell<CellType>>> = [];

	queue.push([trailHead]);

	while (queue.length > 0) {
		const trail = queue.pop()!;
		const last = trail.at(-1)!;

		const possibilities = grid.neighbours(last.x, last.y, false).filter(cell => true
			&& typeof cell.type === 'number'
			&& typeof last.type === 'number'
			&& cell.type === last.type + 1
		);

		for (const possibility of possibilities) {
			if (trail.length === 9) {
				trails.push([...trail, possibility]);
			} else {
				queue.push([...trail, possibility]);
			}
		}
	}

	return trails;
}

solutions[0] = (grid: Input, run = false): number =>  {
	const trailsGetter = createTrailsGetter.bind(null, grid);
	const trailHeads = grid.filterCells(e => e.type === 0);

	let trailCounter = 0;
	for (const trailHead of trailHeads) {
		const trailTails = new Set();
		const trails = trailsGetter(trailHead);

		for (const trail of trails) {
			trailTails.add(`${trail.at(-1)!.x}^${trail.at(-1)!.y}`);
		}

		trailCounter += trailTails.size;
	}

  return trailCounter;
}

solutions[1] = (grid: Input, run = false): number =>  {
	const trailsGetter = createTrailsGetter.bind(null, grid);
	const trailHeads = grid.filterCells(e => e.type === 0);

	let trailCounter = 0;
	for (const trailHead of trailHeads) {
		const trails = trailsGetter(trailHead);
		trailCounter += trails.length;
	}

  return trailCounter;
}
