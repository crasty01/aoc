type Pos = {
  x: number;
  y: number;
}

export class Cell {
  #value: number;
  #position: Pos;

  constructor(value: number, x: number, y: number) {
    this.#value = value;
    this.#position = {
      x: x,
      y: y,
    }
  }


  public get value(): number {
    return this.#value;
  }

  public set value(v: number) {
    this.#value = v;
  }

  public get pos(): Pos {
    return this.#position;
  }

  public set pos(v: Pos) {
    this.#position = v;
  }

  public set x(v: number) {
    this.#position.x = v;
  }

  public set y(v: number) {
    this.#position.y = v;
  }
}

export default class Grid {
  #grid: Array<Array<Cell>> = [];
  #rows: number;
  #cols: number;

  constructor(rows: number, cols: number, def: (x: number, y: number) => number = () => 0) {
    this.#rows = rows;
    this.#cols = cols;

    const grid: Cell[][] = [];

    for (let y = 0; y < rows; y++) {
      grid[y] = [];
      for (let x = 0; x < cols; x++) {
        grid[y][x] = new Cell(def(x, y), x, y);
      }
    }

    this.#grid = grid;
  }

  public neighbours(x: number, y: number): Array<Cell> {
    const neighbours = [];
    for (let rowShift = -1; rowShift < 2; rowShift++) {
      for (let colShift = -1; colShift < 2; colShift++) {
        if (colShift === 0 && rowShift === 0) continue;
        const c = this.cell(x + colShift, y + rowShift)
        if (c) neighbours.push(c)
      }
    }
    return neighbours;
  }

  public cell(x: number, y: number): Cell | null {
    if (
      x >= this.#cols ||
      x < 0 ||
      y >= this.#rows ||
      y < 0
    ) return null
    return this.#grid[y][x]
  }

  public toString(delimiter = ' ') {
    let str = '';
    for (let row = 0; row < this.#rows; row++) {
      for (let col = 0; col < this.#cols; col++) {
        str += `${this.#grid[row][col].value}`.padStart(2, delimiter)
      }
      if (row + 1 < this.#rows) str += '\n';
    }
    return str;
  }

  public map(f: (value: number, x: number, y: number) => number): Grid {
    for (let y = 0; y < this.#rows; y++) {
      for (let x = 0; x < this.#cols; x++) {
        const cell = this.cell(x, y)!;
        cell.value = f(cell.value, cell.x, cell.y)
      }
    }
    return this;
  }

  public filter(f: (value: number, x: number, y: number) => boolean): Array<Cell> {
    const filtered = [];
    for (let y = 0; y < this.#rows; y++) {
      for (let x = 0; x < this.#cols; x++) {
        const cell = this.cell(x, y)!;
        if (f(cell.value, cell.x, cell.y)) {
          filtered.push(cell)
        }
      }
    }
    return filtered
  }
}