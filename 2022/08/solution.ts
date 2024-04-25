type Input = Array<Array<number>>;

const createGrid = <T extends number | string | any>(
  height: number,
  width: number,
  map: (y: number, x: number, grid: Array<Array<T>>) => T,
) => {
  const grid: Array<Array<T>> = [];
  for (let y = 0; y < height; y++) {
    grid[y] = Array.from({ length: width }, (_, x) => map(y, x, grid));
  }
  return grid;
};

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split("\r\n").map((line) =>
    line.split("").map((cell) => parseInt(cell, 10))
  );
};

solutions[0] = (input: Input): number | string => {
  const height = input.length;
  const width = input[0].length;
  const g = createGrid(
    height,
    width,
    () => 0
  );
  let sum = 0;

  for (let x = 0; x < width; x++) {
    let maxTop = -1;
    let maxBottom = -1;
    for (let y = 0; y < height; y++) { // from top
      if (input[y][x] <= maxTop) continue;
      maxTop = input[y][x];
      g[y][x] = 1;
    }
    for (let y = height - 1; y >= 0; y--) { // from bottom
      if (input[y][x] <= maxBottom) continue;
      maxBottom = input[y][x];
      g[y][x] = 1;
    }
  }

  for (let y = 0; y < height; y++) {
    let maxLeft = -1;
    let maxRight = -1;
    for (let x = 0; x < width; x++) { // from top
      if (input[y][x] <= maxLeft) continue;
      maxLeft = input[y][x];
      g[y][x] = 1;
    }
    for (let x = width - 1; x >= 0; x--) { // from bottom
      if (input[y][x] <= maxRight) continue;
      maxRight = input[y][x];
      g[y][x] = 1;
    }
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (g[y][x] === 1) sum += 1;
    }
  }

  return sum;
};

solutions[1] = (input: Input): number | string => {
  const height = input.length;
  const width = input[0].length;
  let max = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const view = [0, 0, 0, 0];

      for (let i = y - 1; i >= 0; i--) {
        view[0] += 1;
        if (input[i][x] >= input[y][x]) break;
      }

      for (let i = x - 1; i >= 0; i--) {
        view[1] += 1;
        if (input[y][i] >= input[y][x]) break;
      }

      for (let i = y + 1; i < height; i++) {
        view[2] += 1;
        if (input[i][x] >= input[y][x]) break;
      }

      for (let i = x + 1; i < width; i++) {
        view[3] += 1;
        if (input[y][i] >= input[y][x]) break;
      }
      
      max = Math.max(max, view.reduce((acc, e) => acc * e))
    }
  }
  return max;
};