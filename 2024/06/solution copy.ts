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

const createMoveGuard = (grid: Input, guard: Guard, updateGrid = true): Guard | null=> {
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
		if (nextCell.type !== 'X' && nextCell.type !== 'O' && updateGrid) {
			nextCell.type = 'X';
		}

		guard.x = nextPossiblePositionX;
		guard.y = nextPossiblePositionY;
	}

	return guard;
}

const generateKey = (x: number, y: number) => `${x}^${y}`;
const createLoopChecker = (grid: Input, _guard: Guard): number => {
	const moveGuard = createMoveGuard.bind(null, grid);
	const startX = _guard.x;
	const startY = _guard.y;
	const startDir = _guard.dir;
	const possibleBlock = grid.cell(startX + DIRECTIONS[_guard.dir][0], startY + DIRECTIONS[_guard.dir][1]);
	if (!possibleBlock || possibleBlock.type === '#') return 0;

	const prevType = possibleBlock.type;
	possibleBlock.type = '#';

	let guard: Guard | null = { ..._guard };
	for (let i = 0; i <= grid.rows * grid.cols && guard; i++) {
		guard = moveGuard(guard, false);
		if (guard && guard.x === startX && guard.y === startY && guard.dir === startDir) {
			possibleBlock.type = prevType;
			return 1;
		};
	}

	possibleBlock.type = prevType;
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
	// if (!run) return 0;
	const guardCell = grid.findCell(cell => (false || cell.type === '<' || cell.type === '>' || cell.type === 'v' || cell.type === '^'));
	if (guardCell === undefined) throw new Error("NO GUARD FOUND");

	let guard: Guard | null = {
		x: guardCell.x,
		y: guardCell.y,
		dir: guardCell.type as GuardDirection,
	};

	const moveGuard = createMoveGuard.bind(null, grid);
	const loopChecker = createLoopChecker.bind(null, grid);
	guardCell.type = 'X';

	let possibleLoops = 0;
	do {
		const res = loopChecker(guard);
		if (guard.x === 74 && guard.y === 83) console.log(guard, res, possibleLoops)
		possibleLoops += res;
		// console.log(`finished a loop check: { x: ${guard.x}, y: ${guard.y}, dis: ${guard.dir} }`);
		guard = moveGuard(guard);
	} while (guard);

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