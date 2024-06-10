export type CellType = '.' | '#' | '>' | '<' | '^' | 'v';
export type Pos = {
  x: number;
  y: number;
}

export class Cell {
  #position: Pos;
  #grid: Grid;
	#index: number;
  type: CellType;

  constructor(type: CellType, x: number, y: number, grid: Grid) {
    this.#position = {
      x: x,
      y: y,
    }
		this.type = type;
    this.#grid = grid
		this.#index = y * grid.cols + x;
  }

  get neighbours(): Array<Cell> {
    return this.#grid.neighbours(this.#position.x, this.#position.y)
  }

  get pos(): Pos {
    return this.#position;
  }

  get x() {
    return this.#position.x
  }

  get y() {
    return this.#position.y
  }

	get index() {
		return this.#index
	}

	get string() {
		return `{ x: ${this.x}, y: ${this.y}, index: ${this.index}, type: ${this.type} }`
	}
}

export class Grid {
	#cells: Array<Cell>;
  #grid: Array<Array<Cell>>;
  #rows: number;
  #cols: number;

   constructor(rows: number, cols: number, def: (x: number, y: number) => CellType) {
    this.#rows = rows;
    this.#cols = cols;

    const grid: Cell[][] = [];
    const cells: Cell[] = [];

    for (let y = 0; y < rows; y++) {
      grid[y] = [];
      for (let x = 0; x < cols; x++) {
				const cell = new Cell(def(x, y), x, y, this);
				cells[y * cols + x] = cell;
        grid[y][x] = cell;
      }
    }

    this.#cells = cells;
    this.#grid = grid;
  }

  neighbours(x: number, y: number): Array<Cell> {
    const neighbours = [];

    neighbours.push(this.cell(x, y - 1))
    neighbours.push(this.cell(x + 1, y))
    neighbours.push(this.cell(x, y + 1))
    neighbours.push(this.cell(x - 1, y))

    return neighbours.filter(e => e !== null) as Array<Cell>;
  }

	filterCells(predicate: (value: Cell, index: number) => boolean) {
		return this.#cells.filter(predicate);
	}


	findCell(predicate: (value: Cell, index: number) => boolean) {
		return this.#cells.find(predicate);
	}

  cell(x: number, y: number): Cell | null {
    if (!this.isInBounds(x, y)) return null
    return this.#grid[y][x]
  }

	isInBounds(x: number, y: number) {
		return !(x >= this.#cols || x < 0 || y >= this.#rows || y < 0);
	}

  toString() {
    let str = '';
    for (let row = 0; row < this.#rows; row++) {
      for (let col = 0; col < this.#cols; col++) {
        str += this.#grid[row][col].type;
      }
      if (row + 1 < this.#rows) str += '\n';
    }
    return str;
  }

	getRow(index: number) {
		return this.#grid[index];
	}

	getColumn(index: number) {
		return this.#grid.map(e => e[index]);
	}

	get rows() {
		return this.#rows;
	}
	get cols() {
		return this.#cols;
	}
	get cells() {
		return this.#cells;
	}
}