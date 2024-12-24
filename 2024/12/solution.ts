import { Cell, Grid } from './Grid.ts';

type CellType = string;
type Input = Grid<CellType>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
	const w = rawInut.search(/\r?\n/);
	const c = rawInut.search(/\r\n/) !== -1 ? 2 : 1;
	const h = (rawInut.length + c) / (w + c);
  return new Grid<CellType>(w, h, (x, y) => rawInut[y * (w + c) + x]);
}

solutions[0] = (grid: Input, run = false): number =>  {
	const visited = new Set<number>();
	
	let sum = 0;
	for (const cell of grid.cells) {
		if (visited.has(cell.index)) continue;

		const queue: Array<Cell<CellType>> = [cell];
		let area = 0;
		let edges = 0;
		
		while (queue.length > 0) {
			const c = queue.pop()!;
			if (visited.has(c.index)) continue;
			visited.add(c.index);
			area += 1;
			const n = c.neighbours;
			edges += 4 - n.length + n.filter(e => e.type !== c.type).length;
			for (let i = 0; i < n.length; i++) {
				if (n[i].type === c.type && !visited.has(n[i].index)) {
					queue.push(n[i]);
				}
			}
		}

		sum += edges * area;
	}
	
  return sum;
}

const createEdgeCoutner = (grid: Input, cells: Array<Cell<CellType>>): number => {
	let edges = 0;

	const top = [];
	const right = [];
	const bottom = [];
	const left = [];


	for (const cell of cells) {
		if (grid.cell(cell.x, cell.y - 1)?.type !== cell.type) {
			top.push(cell);
		}
		if (grid.cell(cell.x + 1, cell.y)?.type !== cell.type) {
			right.push(cell);
		}
		if (grid.cell(cell.x, cell.y + 1)?.type !== cell.type) {
			bottom.push(cell);
		}
		if (grid.cell(cell.x - 1, cell.y)?.type !== cell.type) {
			left.push(cell);
		}
	}

	const topSet = new Set(top.map(cell => `${cell.x}^${cell.y}`));
	const rightSet = new Set(right.map(cell => `${cell.x}^${cell.y}`));
	const bottomSet = new Set(bottom.map(cell => `${cell.x}^${cell.y}`));
	const leftSet = new Set(left.map(cell => `${cell.x}^${cell.y}`));

	for (const cell of cells) {
		const id = `${cell.x}^${cell.y}`;
		
		if (topSet.has(id) && !topSet.has(`${cell.x - 1}^${cell.y}`)) edges += 1;
		if (rightSet.has(id) && !rightSet.has(`${cell.x}^${cell.y - 1}`)) edges += 1;
		if (bottomSet.has(id) && !bottomSet.has(`${cell.x - 1}^${cell.y}`)) edges += 1;
		if (leftSet.has(id) && !leftSet.has(`${cell.x}^${cell.y - 1}`)) edges += 1;
	}

	return edges;
};

solutions[1] = (grid: Input, run = false): number =>  {
	const visited = new Set<number>();
	const edgeCounter = createEdgeCoutner.bind(null, grid);
	
	let sum = 0;
	for (const cell of grid.cells) {
		if (visited.has(cell.index)) continue;

		const queue: Array<Cell<CellType>> = [cell];
		const region: Array<Cell<CellType>> = []
		
		while (queue.length > 0) {
			const c = queue.pop()!;
			if (visited.has(c.index)) continue;
			visited.add(c.index);
			region.push(c);
			const n = c.neighbours;
			for (let i = 0; i < n.length; i++) {
				if (n[i].type === c.type && !visited.has(n[i].index)) {
					queue.push(n[i]);
				}
			}
		}
		
		const edgeCount = edgeCounter(region);

		sum += region.length * edgeCount;
	}
	
  return sum;
}