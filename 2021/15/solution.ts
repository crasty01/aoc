import Grid, { Cell } from './Pathfinding.ts';
import { assert } from "std/testing/asserts.ts";

type Input = Array<Array<number>>;

export const parseInput = (rawInut: string): Input => {
  return rawInut.split('\r\n').map(e => e.split('').map(Number));
}

export const solution1 = (input: Input): number | string =>  {
  const rows = input.length;
  const cols = input[0].length;
  const grid = new Grid(rows, cols, (x, y) => input[y][x])

  const open: Array<Cell> = [];
  const closed: Array<Cell> = [];

  const start = grid.cell(0, 0);
  const end = grid.cell(cols - 1, rows - 1)!;

  assert(start !== null, 'no start!');
  start.g = 0;
  open.push(start);

  while (open.length > 0) {
    const current_index = open.reduce((pi, c, i, array) => pi === -1 ? i : (array[pi].f < c.f ? pi : i), -1);
    assert(current_index >= 0, 'current_index wrong!')
    const current = open.splice(current_index, 1)[0];
    closed.push(current)

    if (current === end) break;

    for (const neighbour of current.neighbours) {
      if (closed.includes(neighbour)) continue; // not reaversable or in closed
      const g_tmp = current.g + neighbour.cost;
      if (g_tmp < neighbour.g) {
        neighbour.g = g_tmp;
        neighbour.prev = current;
        if (!open.includes(neighbour)) open.push(neighbour)
      }
    }
  }

  let sum = 0;
  let c = end;
  do {
    sum += c.cost;
    c = c.prev!
  } while (c.prev !== null)

  return sum;
}

export const solution2 = (input: Input): number | string =>  {
  const rows_og = input.length;
  const cols_og = input[0].length;

  const rows = rows_og * 5;
  const cols = cols_og * 5;

  const grid = new Grid(rows, cols, (x, y) => {
    const p = Math.floor(x / cols_og) + Math.floor(y / rows_og);
    const v = input[y % rows_og][x % cols_og]
    return (v + p) % 10 + Math.floor((v + p) / 10);
  })

  const open: Array<Cell> = [];
  const closed: Array<Cell> = [];

  const start = grid.cell(0, 0);
  const end = grid.cell(cols - 1, rows - 1)!;

  assert(start !== null, 'no start!');
  start.g = 0;
  open.push(start);

  while (open.length > 0) {
    const current_index = open.reduce((pi, c, i, array) => pi === -1 ? i : (array[pi].f < c.f ? pi : i), -1);
    assert(current_index >= 0, 'current_index wrong!')
    const current = open.splice(current_index, 1)[0];
    closed.push(current)

    if (current === end) break;

    for (const neighbour of current.neighbours) {
      if (closed.includes(neighbour)) continue;
      const g_tmp = current.g + neighbour.cost;
      if (g_tmp < neighbour.g) {
        neighbour.g = g_tmp;
        neighbour.prev = current;
        if (!open.includes(neighbour)) open.push(neighbour)
      }
    }
  }

  let sum = 0;
  let c = end;
  do {
    sum += c.cost;
    c = c.prev!
  } while (c.prev !== null)

  return sum;
}