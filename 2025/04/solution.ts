import { Grid, Cell } from "./Grid.ts";

type CellType = '@' | '.' | 'x';
type Input = Grid<CellType>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
	const w = rawInut.search(/\r?\n/);
	const c = rawInut.search(/\r\n/) !== -1 ? 2 : 1;
	const h = (rawInut.length + c) / (w + c);
  return new Grid<CellType>(w, h, (x, y) => rawInut[y * (w + c) + x] as CellType);
}

solutions[0] = (input: Input, run = false): number => {
	let count = 0;
	for (const cell of input.cells) {
		if (cell.type !== '@') continue;
		const rolls = cell.neighbours.filter(neighbour => neighbour.type === '@');
		if (rolls.length < 4) {
			count += 1;
		}
	}

  return count;
}

solutions[1] = (input: Input, run = false): number => {
	let removed = Infinity;
	let count = 0;
	while (removed > 0) {
		const removable = [];
		for (const cell of input.cells) {
			if (cell.type !== '@') continue;

			const rolls = cell.neighbours.filter(neighbour => neighbour.type === '@');
			if (rolls.length < 4) {
				removable.push(cell)
			}
		}

		removed = removable.length;
		count += removed;
		
		for (const cell of removable) {
			cell.type = '.';
		}
	}

  return count;
}

const example = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`;

for (let i = 0; i < solutions.length; i++) {
	console.log(`solution[${i}]:`, solutions[i](parseInput(example), true))
}