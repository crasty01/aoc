export type CellType = 'S' | '.' | '#'
export type Pos = {
  x: number;
  y: number;
}

export class Cell {
  #position: Pos;
  #grid: Grid;
  step: number;
  type: CellType;

  constructor([step, type]: [number, CellType], x: number, y: number, grid: Grid) {
    this.#position = {
      x: x,
      y: y,
    }
		this.step = step;
		this.type = type;
    this.#grid = grid
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
}

export class Grid {
	#cells: Array<Cell>;
  #grid: Array<Array<Cell>>;
  #rows: number;
  #cols: number;

  constructor(rows: number, cols: number, def: (x: number, y: number) => [number, CellType]) {
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

	fill = (x: number, y: number, steps: number) => {
		if (!this.isInBounds(x, y)) throw new Error(`INVALID STARTING POSITION: {x: ${x}, y: ${y}}`);
		
		this.cell(x, y)!.step = 0;
		for (let i = 0; i < steps; i++) {
			const cells = this.filterCells((cell) => cell.step === i);

			for (const cell of cells) {
				const neighbours = cell.neighbours.filter(e => e.step === -1 && e.type !== '#')
				for (const neighbour of neighbours) neighbour.step = i + 1;
			}
		}

		const reachable = this.filterCells((cell) => cell.type !== '#' && cell.step % 2 === steps % 2).length;

		for (const cell of this.cells) {
			cell.step = -1;
		}

		return reachable;
	}

  toString(step = 0) {
    let str = '';
    for (let row = 0; row < this.#rows; row++) {
      for (let col = 0; col < this.#cols; col++) {
        str += this.#grid[row][col].step === step ? '0' : this.#grid[row][col].type;
      }
      if (row + 1 < this.#rows) str += '\n';
    }
    return str;
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