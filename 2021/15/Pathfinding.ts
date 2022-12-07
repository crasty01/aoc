type Pos = {
  x: number;
  y: number;
}

export class Cell {
  #position: Pos;
  #grid: Grid;

  public g = Infinity;
  public h = 0;
  public cost: number;
  public prev: Cell | null = null;

  constructor(cost: number, x: number, y: number, rows: number, cols: number, grid: Grid) {
    this.#position = {
      x: x,
      y: y,
    }

    this.#grid = grid
    this.cost = cost
    this.h = cols - x + rows - y - 2;
  }

  public get f(): number {
    return this.g + this.h
  }

  public get neighbours(): Array<Cell> {
    return this.#grid.neighbours(this.#position.x, this.#position.y)
  }




  public get pos(): Pos {
    return this.#position;
  }

  public get x() {
    return this.#position.x
  }

  public get y() {
    return this.#position.y
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
        grid[y][x] = new Cell(def(x, y), x, y, this.#rows, this.#cols, this);
      }
    }

    this.#grid = grid;
  }

  public neighbours(x: number, y: number): Array<Cell> {
    const neighbours = [];

    neighbours.push(this.cell(x, y - 1))
    neighbours.push(this.cell(x + 1, y))
    neighbours.push(this.cell(x, y + 1))
    neighbours.push(this.cell(x - 1, y))

    return neighbours.filter(e => e !== null) as Array<Cell>;
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
        str += `${this.#grid[row][col].cost}`.padStart(2, delimiter)
      }
      if (row + 1 < this.#rows) str += '\n';
    }
    return str;
  }
}