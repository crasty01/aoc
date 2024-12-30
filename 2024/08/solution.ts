import { Grid, Cell } from './Grid.ts';

type CellType = string;
type Input = Grid<CellType>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
	const w = rawInut.search(/\r?\n/);
	const c = rawInut.search(/\r\n/) !== -1 ? 2 : 1;
	const h = (rawInut.length + c) / (w + c);
  return new Grid<CellType>(w, h, (x, y) => rawInut[y * (w + c) + x] as CellType);
}

solutions[0] = (grid: Input, run = false): number => {
	const antinodes = new Set<number>();
	const antennas = new Map<string, Array<Cell<CellType>>>();

	for (let i = 0; i < grid.cells.length; i++) {
		const cell = grid.cells[i];
		if (cell.type === '.') continue;
		if (!antennas.has(cell.type)) antennas.set(cell.type, []);

		const others = antennas.get(cell.type)!;
		for (let j = 0; j < others.length; j++) {
			const diffX = cell.x - others[j].x;
			const diffY = cell.y - others[j].y;

			const a = grid.cell(cell.x + diffX, cell.y + diffY);
			if (a) antinodes.add(a.index);
			const b = grid.cell(others[j].x - diffX, others[j].y - diffY);
			if (b) antinodes.add(b.index);
		}

		others.push(cell);
	}

  return antinodes.size;
}

solutions[1] = (grid: Input, run = false): number => {
	const antinodes = new Set<number>();
	const antennas = new Map<string, Array<Cell<CellType>>>();

	for (let i = 0; i < grid.cells.length; i++) {
		const cell = grid.cells[i];
		if (cell.type === '.') continue;
		if (!antennas.has(cell.type)) antennas.set(cell.type, []);

		const others = antennas.get(cell.type)!;
		for (let j = 0; j < others.length; j++) {
			const diffX = cell.x - others[j].x;
			const diffY = cell.y - others[j].y;

			let a, b;
			let i = 0;
			do {
				a = grid.cell(cell.x + diffX * i, cell.y + diffY * i);
				b = grid.cell(cell.x + diffX * i * -1, cell.y + diffY * i * -1);
				if (a) antinodes.add(a.index);
				if (b) antinodes.add(b.index);
				i += 1;
			} while (a || b);
		}
		others.push(cell);
	}

  return antinodes.size;
}