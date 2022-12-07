import Grid from './Grid.ts';

type Input = Array<Array<number>>;

const next = (grid: Grid): number => {
  grid.map((v) => v + 1);
  const toBlink = grid.filter((v) => v > 9);
  const blinked = new Set();
  while (toBlink.length > 0) {
    const c = toBlink.shift()!;
    blinked.add(`${c.pos.x}-${c.pos.y}`)
    const n = grid.neighbours(c.pos.x, c.pos.y);
    n.forEach((e) => (e.value += 1));
    n.filter(e => e.value > 9 && !blinked.has(`${e.pos.x}-${e.pos.y}`)).forEach(e => {
      if (toBlink.indexOf(e) < 0) toBlink.push(e)
    })
  }
  grid.map((v) => (v > 9 ? 0 : v));
  return blinked.size
};

export const parseInput = (rawInut: string): Input => {
  return rawInut.split('\r\n').map(e => e.split('').map(Number));
}

export const solution1 = (input: Input): number | string =>  {
  const g = new Grid(10, 10, (x, y) => input[y][x]);
  let n = 0;
  for (let i = 0; i < 100; i++) {
    n += next(g);
  }
  return n;
}

export const solution2 = (input: Input): number | string =>  {
  const g = new Grid(10, 10, (x, y) => input[y][x]);
  let i = 0, allFlashed = false;
  do {
    i++;
    const n = next(g)
    if (n === 100) allFlashed = true
  } while (!allFlashed)
  return i;
}