import { Grid, Cell } from "./Grid.ts";

type GuardDirection = '<' | '>' | 'v' | '^'
type CellType = '#' | '.' | 'X' | 'O' | GuardDirection;
type Input = Grid<CellType>;
type Guard = {
	x: number;
	y: number;
	dir: GuardDirection;
}
type Memory = Record<GuardDirection | '-', Set<string>>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
	const w = rawInut.search(/\r?\n/);
	const c = rawInut.search(/\r\n/) !== -1 ? 2 : 1;
	const h = (rawInut.length + c) / (w + c);
  return new Grid<CellType>(w, h, (x, y) => rawInut[y * (w + c) + x] as CellType);
}

const DIRECTIONS = {
	'<': [-1, +0, '^'],
	'>': [+1, +0, 'v'],
	'v': [+0, +1, '<'],
	'^': [+0, -1, '>'],
} satisfies Record<GuardDirection, [number, number, GuardDirection]>;

const createMoveGuard = (grid: Input, guard: Guard): Guard | null=> {
	const direction = DIRECTIONS[guard.dir];
	const nextPossiblePositionX = guard.x + direction[0];
	const nextPossiblePositionY = guard.y + direction[1];
	const nextCell = grid.cell(nextPossiblePositionX, nextPossiblePositionY);

	if (!nextCell) {
		return null;
	}
	
	if (nextCell.type === '#') {
		guard.dir = direction[2];
	} else {
		if (nextCell.type !== 'X' && nextCell.type !== 'O') {
			nextCell.type = 'X';
		}

		guard.x = nextPossiblePositionX;
		guard.y = nextPossiblePositionY;
	}

	return guard;
}

const generateKey = (x: number, y: number) => `${x}^${y}`;
const createLoopChecker = (grid: Input, guard: Guard, memory: Memory): number => {
	const dir = DIRECTIONS[guard.dir][2];
	const move = DIRECTIONS[dir];
	// const moves: Array<string> = [];

	let cell: Cell<CellType> | null = grid.cell(guard.x, guard.y);

	while (cell && cell.type !== '#') {
		const key = generateKey(cell.x, cell.y);
		// moves.push(key);
		if (memory[dir].has(key)) {
			// console.log('moves:', moves);
			return 1;
		}

		cell = grid.cell(cell.x + move[0], cell.y + move[1]);
	}

	return 0;
}

solutions[0] = (grid: Input, run = false): number =>  {
	const guardCell = grid.findCell(cell => (false || cell.type === '<' || cell.type === '>' || cell.type === 'v' || cell.type === '^'));
	if (guardCell === undefined) throw new Error("NO GUARD FOUND");

	let guard: Guard | null = {
		x: guardCell.x,
		y: guardCell.y,
		dir: guardCell.type as GuardDirection,
	};

	const moveGuard = createMoveGuard.bind(null, grid);
	guardCell.type = 'X';

	while (guard) {
		guard = moveGuard(guard);
	};


  return grid.filterCells(cell => cell.type === 'X').length;
}

solutions[1] = (grid: Input, run = false): number =>  {
	const guardCell = grid.findCell(cell => (false || cell.type === '<' || cell.type === '>' || cell.type === 'v' || cell.type === '^'));
	if (guardCell === undefined) throw new Error("NO GUARD FOUND");

	let guard: Guard | null = {
		x: guardCell.x,
		y: guardCell.y,
		dir: guardCell.type as GuardDirection,
	};

	const memory: Memory = {
		'-': new Set<string>(),
		'<': new Set<string>(),
		'>': new Set<string>(),
		'v': new Set<string>(),
		'^': new Set<string>(),
	}

	const moveGuard = createMoveGuard.bind(null, grid);
	const loopChecker = createLoopChecker.bind(null, grid);
	guardCell.type = 'X';

	let possibleLoops = 0;
	do {
		possibleLoops += loopChecker({ ...guard }, memory);

		const key = generateKey(guard.x, guard.y);
		memory['-'].add(key);
		memory[guard.dir].add(key);

		guard = moveGuard(guard);
	} while (guard);

	// console.log(mem)

  return possibleLoops;
}

/*
  0123456789
0 ....#.....
1 .........#
2 ..........
3 ..#.......
4 .......#..
5 ..........
6 .#..^.....
7 ........#.
8 #.........
9 ......#...
*/

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

console.log('result:', solutions[1](parseInput(example), true));