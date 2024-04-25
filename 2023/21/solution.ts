import { assert } from "https://deno.land/std@0.167.0/_util/asserts.ts";
import { CellType, Grid } from "./Grid.ts";

type Input = Array<string>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split(/\r?\n/g);
};

solutions[0] = (input: Input): number => {
  const grid = new Grid(
    input.length,
    input[0].length,
    (x, y) => [-1, input[y][x] as CellType],
  );
  const start = grid.findCell((cell) => cell.type === "S")!;
  return grid.fill(start.x, start.y, 64);
};

solutions[1] = (input: Input): number => {
  const grid = new Grid(
    input.length,
    input[0].length,
    (x, y) => [-1, input[y][x] as CellType],
  );
  const start = grid.findCell((cell) => cell.type === "S");

  const STEPS = 26501365;
  const SIZE = grid.cols;

  // assumptions:
  assert(grid.rows === grid.cols, "grid must be a square");
  assert(SIZE % 2 === 1, "grid size must be odd");
  assert(start, "grid must have a start");
  assert(
    start.x === SIZE >> 1 && start.y === SIZE >> 1,
    "start must be in center",
  );

  for (let i = 0; i < SIZE; i++) {
    assert(
      grid.cell(i, 0)?.type === ".",
      `all borders and center lines must be walkable: ${[i, 0]}`,
    );
    assert(
      i === start.y || grid.cell(i, start.y)?.type === ".",
      `all borders and center lines must be walkable: ${[i, start.y]}`,
    );
    assert(
      grid.cell(i, SIZE - 1)?.type === ".",
      `all borders and center lines must be walkable: ${[i, SIZE - 1]}`,
    );

    assert(
      grid.cell(0, i)?.type === ".",
      `all borders and center lines must be walkable: ${[0, i]}`,
    );
    assert(
      i === start.x || grid.cell(start.x, i)?.type === ".",
      `all borders and center lines must be walkable: ${[start.x, i]}`,
    );
    assert(
      grid.cell(SIZE - 1, i)?.type === ".",
      `all borders and center lines must be walkable: ${[SIZE - 1, i]}`,
    );
  }

  assert(STEPS % SIZE === SIZE >> 1, "STEPS % SIZE === SIZE >> 1");

  const gridWidth = Math.floor(STEPS / SIZE) - 1;
  const odd = (Math.floor(gridWidth / 2) * 2 + 1) ** 2;
  const even = (Math.floor((gridWidth + 1) / 2) * 2) ** 2;

  const reachableOnOdd = grid.fill(start.x, start.y, SIZE * 2 + 1);
  const reachableOnEven = grid.fill(start.x, start.y, SIZE * 2);

  const reachableTop = grid.fill(start.x, SIZE - 1, SIZE - 1);
  const reachableRight = grid.fill(0, start.y, SIZE - 1);
  const reachableBottom = grid.fill(start.x, 0, SIZE - 1);
  const reachableLeft = grid.fill(SIZE - 1, start.y, SIZE - 1);

	const smallSteps = Math.floor(SIZE / 2) - 1;
	
	const reachableSmallTopRight = grid.fill(0, SIZE - 1, smallSteps);
	const reachableSmallBottomRight = grid.fill(0, 0, smallSteps);
	const reachableSmallBottomLeft = grid.fill(SIZE - 1, 0, smallSteps);
	const reachableSmallTopLeft = grid.fill(SIZE - 1, SIZE - 1, smallSteps);
	
	const largeSteps = Math.floor((SIZE * 3) / 2) - 1;
	
	const reachableLargeTopRight = grid.fill(0, SIZE - 1, largeSteps);
	const reachableLargeBottomRight = grid.fill(0, 0, largeSteps);
	const reachableLargeBottomLeft = grid.fill(SIZE - 1, 0, largeSteps);
	const reachableLargeTopLeft = grid.fill(SIZE - 1, SIZE - 1, largeSteps);

	return (0
		+ odd * reachableOnOdd
		+ even * reachableOnEven
		+ reachableTop
		+ reachableRight
		+ reachableBottom
		+ reachableLeft
		+ (gridWidth + 1) * (0
			+ reachableSmallTopRight
			+ reachableSmallBottomRight
			+ reachableSmallBottomLeft
			+ reachableSmallTopLeft)
		+ gridWidth * (0
			+ reachableLargeTopRight
			+ reachableLargeBottomRight
			+ reachableLargeBottomLeft
			+ reachableLargeTopLeft
			)
		)
};
