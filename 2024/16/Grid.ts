export type Pos = {
  x: number;
  y: number;
}

export class Cell<CellType extends any> {
  #position: Pos;
  #grid: Grid<CellType>;
	#index: number;
  type: CellType;
	dist: number;

  constructor(type: CellType, x: number, y: number, grid: Grid<CellType>) {
    this.#position = {
      x: x,
      y: y,
    }
		this.dist = Infinity;
		this.type = type;
    this.#grid = grid
		this.#index = y * grid.cols + x;
  }

  get neighbours(): Array<Cell<CellType>> {
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
		return `{ x: ${this.x}, y: ${this.y}, index: ${this.index}, type: ${this.type}, dist: ${this.dist} }`
	}
}

export class Grid<CellType extends any> {
	#cells: Array<Cell<CellType>>;
  #grid: Array<Array<Cell<CellType>>>;
  #rows: number;
  #cols: number;

   constructor(rows: number, cols: number, def: (x: number, y: number) => CellType) {
    this.#rows = rows;
    this.#cols = cols;

    const grid: Cell<CellType>[][] = [];
    const cells: Cell<CellType>[] = [];

    for (let y = 0; y < rows; y++) {
      grid[y] = [];
      for (let x = 0; x < cols; x++) {
				const cell = new Cell<CellType>(def(x, y), x, y, this);
				cells[y * cols + x] = cell;
        grid[y][x] = cell;
      }
    }

    this.#cells = cells;
    this.#grid = grid;
  }

  neighbours(x: number, y: number, diagonal = false): Array<Cell<CellType>> {
    const neighbours = [];

    neighbours.push(this.cell(x + 0, y - 1));
    if (diagonal) neighbours.push(this.cell(x + 1, y - 1));
    neighbours.push(this.cell(x + 1, y + 0));
    if (diagonal) neighbours.push(this.cell(x + 1, y + 1));
    neighbours.push(this.cell(x + 0, y + 1));
    if (diagonal) neighbours.push(this.cell(x - 1, y + 1));
    neighbours.push(this.cell(x - 1, y + 0));
    if (diagonal) neighbours.push(this.cell(x - 1, y - 1));

    return neighbours.filter(e => e !== null) as Array<Cell<CellType>>;
  }

	filterCells(predicate: (value: Cell<CellType>, index: number) => boolean) {
		return this.#cells.filter(predicate);
	}

	getLine(a: Pos, b: Pos) {
		const diffX = Math.abs(a.x - b.x);
		const diffY = Math.abs(a.y - b.y);

		if (diffX !== 0 && diffY !== 0 && diffX !== diffY) return null;

		const length = Math.max(diffX, diffY);
		const dirX = Math.sign(b.x - a.x);
		const dirY = Math.sign(b.y - a.y);
		
		const line: Array<Cell<CellType> | null> = Array.from({ length }, (_, i) => {
			return this.cell(a.x + (dirX * i), a.y + (dirY * i));
		});

		if (line.some(e => e === null)) return null;
		return line as Array<Cell<CellType>>;
	}


	findCell(predicate: (value: Cell<CellType>, index: number) => boolean) {
		return this.#cells.find(predicate);
	}

  cell(x: number, y: number): Cell<CellType> | null {
    if (!this.isInBounds(x, y)) return null
    return this.#grid[y][x]
  }

  cellByIndex(index: number): Cell<CellType> | null {
    return this.#cells[index];
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