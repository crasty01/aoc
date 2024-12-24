import { Grid } from "./Grid.ts";

type CellType = 'X' | 'M' | 'A' | 'S';
type Input = Grid<CellType>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
	const w = rawInut.search(/\r?\n/);
	const c = rawInut.search(/\r\n/) !== -1 ? 2 : 1;
	const h = (rawInut.length + c) / (w + c);
  return new Grid<CellType>(w, h, (x, y) => rawInut[y * (w + c) + x] as CellType);
}

solutions[0] = (grid: Input, run = false): number =>  {
	const xs = grid.filterCells((cell) => cell.type === 'X');

	let count = 0;

	for (const x of xs) {
		const neighbours = x.neighbours.filter(cell => cell.type === 'M');
		for (const neighbour of neighbours) {
			const dirX = neighbour.x - x.x;
			const dirY = neighbour.y - x.y;
			const line = grid.getLine(x.pos, { x: x.x + dirX * 4, y: x.y + dirY * 4 });
			if (!line) continue;

			const text = line.map(cell => cell.type).join('');
			if (text === 'XMAS') count += 1;
		}
	}

  return count;
}

solutions[1] = (grid: Input, run = false): number =>  {
	const as = grid.filterCells((cell) => true
		&& cell.x > 0
		&& cell.x < grid.cols - 1
		&& cell.y > 0
		&& cell.y < grid.rows - 1
		&& cell.type === 'A'
	);

	let count = 0;

	for (const a of as) {
		const tl = grid.cell(a.x - 1, a.y - 1);
		const tr = grid.cell(a.x + 1, a.y - 1);
		const br = grid.cell(a.x + 1, a.y + 1);
		const bl = grid.cell(a.x - 1, a.y + 1);

		if (!tl || !tr || !br || !bl) continue;
		if (true
			&& ((tr.type === 'M' && bl.type == 'S') || (tr.type === 'S' && bl.type == 'M'))
			&& ((tl.type === 'M' && br.type == 'S') || (tl.type === 'S' && br.type == 'M'))
		) {
			count += 1;
		}
	}

  return count;
}