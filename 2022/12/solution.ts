type Pos = {x: number, y: number};
type Input = [Pos, Pos, Array<Array<number>>];

export const getCellHeight = (cell: string): number => {
  if (cell === 'S') return 1;
  if (cell === 'E') return 26;
  return cell.charCodeAt(0) - 96;
}

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  let start: Pos | undefined;
  let end: Pos | undefined;

  const grid = rawInut.split('\r\n').map((line, index) => {
    const row = [] as Array<number>;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === 'S') start = {x: i, y: index};
      if (line[i] === 'E') end = {x: i, y: index};
      row.push(getCellHeight(line[i]));
    }
    return row;
  });

  if (!start || !end) throw new Error('No start or end found');
  return [start, end, grid];
}

const getShortedstPath = (start: Pos, end: Pos, grid: Array<Array<number>>): number => {  
  const queue = [{ ...start, steps: 0 }];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.x === end.x && current.y === end.y) return current.steps;
    const next = [
      { x: current.x - 1, y: current.y },
      { x: current.x + 1, y: current.y },
      { x: current.x, y: current.y - 1 },
      { x: current.x, y: current.y + 1 },
    ];
    for (const pos of next) {
      if (pos.x < 0 || pos.x >= grid[0].length || pos.y < 0 || pos.y >= grid.length) continue;
      if (visited.has(`${pos.x},${pos.y}`)) continue;
      if (grid[pos.y][pos.x] - grid[current.y][current.x] > 1) continue;
      visited.add(`${pos.x},${pos.y}`);
      queue.push({ ...pos, steps: current.steps + 1 });
    }
  }

  throw new Error("No solution found");
}

solutions[0] = ([start, end, grid]: Input): number | string =>  {
  return getShortedstPath(start, end, grid);
}

solutions[1] = ([_, end, grid]: Input): number | string =>  {
  let shortestPath = Number.MAX_SAFE_INTEGER;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === 1) {
        try {
          const path = getShortedstPath({ x, y }, end, grid);
          if (path < shortestPath) shortestPath = path;
        } catch (e) {
          // no path found
        }
      }
    }
  }

  return shortestPath;
}