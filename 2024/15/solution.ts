import { Grid, Cell } from './Grid.ts';

type CellType = '#' | '.' | '@' | 'O';
const MOVES = {
	'^': [+0, -1],
	'>': [+1, +0],
	'v': [+0, +1],
	'<': [-1, +0],
} as const;
type MoveType = keyof typeof MOVES;
type Input = {
	grid: Grid<CellType>;
	moves: string;
};
type Robot = {
	x: number;
	y: number;
}

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  const [rawGrid, rawMovement] = rawInut.split(/\r?\n\r?\n/);

	const w = rawGrid.search(/\r?\n/);
	const c = rawGrid.search(/\r\n/) !== -1 ? 2 : 1;
	const h = (rawGrid.length + c) / (w + c);

	return {
		grid: new Grid<CellType>(w, h, (x, y) => rawGrid[y * (w + c) + x] as CellType),
		moves: rawMovement.replace(/[^^>v<]+/g, ''),
	}
}

const createMover = (grid: Grid<CellType>) => (robot: Robot, move: MoveType) => {
	const dir = MOVES[move];

	const line = [grid.cell(robot.x, robot.y)!];
	while (line.at(-1)!.type !== '.' && line.at(-1)!.type !== '#') {
		const last = line.at(-1)!;
		line.push(grid.cell(last.x + dir[0], last.y + dir[1])!)
	}

	if (line.at(-1)!.type === '#') return;

	for (let i = line.length - 1; i > 0; i--) {
		[line[i].type, line[i - 1].type] = [line[i - 1].type, line[i].type];
	}

	robot.x = robot.x + dir[0];
	robot.y = robot.y + dir[1];
}

solutions[0] = ({ grid, moves }: Input, run = false): number =>  {
	const mover = createMover(grid);
	const cell = grid.findCell(cell => cell.type === '@');
	if (!cell) throw new Error(`ROBOT WAS NOT FOUND!`);

	const robot: Robot = {
		x: cell.x,
		y: cell.y,
	}

	for (const move of moves) {
		switch (move) {
			case '^':
			case '>':
			case 'v':
			case '<':
				mover(robot, move);
				break;
			default: throw new Error(`UNKNOWN CHARACTER IN MOVES ( move=${move} )`);
		}
	}

	let sum = 0;
	for (const cell of grid.filterCells(cell => cell.type === 'O')) {
		sum += cell.y * 100 + cell.x;
	}
	
  return sum;
}

solutions[1] = (input: Input, run = false): number =>  {
  if (!run) return -1;
  return 0;
}

const example = `##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`;

console.log('result:', solutions[1](parseInput(example), true));