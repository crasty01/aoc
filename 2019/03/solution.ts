const DIRECTIONS = ['R', 'L', 'U', 'D'] as const;
type Key = `${number},${number}`;
type Direction = typeof DIRECTIONS[number];
type Instruction = [Direction, number];
type Wires = Array<Instruction>;
type Input = Array<Wires>;

const movements = [
	[+1, 0],
	[-1, 0],
	[0, +1],
	[0, -1],
]

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split(/\r?\n/g).map(e => e.split(',').map(f => [f[0], parseInt(f.slice(1), 10)] as Instruction));
}

solutions[0] = (input: Input, run = false): number =>  {
	let allPositions = new Set<Key>();
	let allClosest = Infinity;

	for (const instructions of input) {
		const positions = new Set<Key>()
		let x = 0;
		let y = 0;
		for (const [direction, amount] of instructions) {
			const movement = movements[DIRECTIONS.indexOf(direction)]
			for (let i = 1; i <= amount; i++) {
				x = x + movement[0];
				y = y + movement[1];
				
				positions.add(`${x},${y}`);
			}
		}

		const intersections = allPositions.intersection(positions);
		let closest: number = Infinity;
		for (const intersection of intersections) {
			const [x, y] = intersection.split(',').map((e) => parseInt(e, 10));
			closest = Math.min(closest, Math.abs(x) + Math.abs(y));
		}

		allClosest = Math.min(allClosest, closest);
		allPositions = allPositions.union(positions);
	}

	return allClosest;
}

solutions[1] = (input: Input, run = false): number =>  {
	let oldPositions = new Map<Key, number>();
	let allClosest = Infinity;

	for (const instructions of input) {
		const positions = new Map<Key, number>();
		let selfIntersections = 1; // start
		let x = 0;
		let y = 0;
		for (const [direction, amount] of instructions) {
			const movement = movements[DIRECTIONS.indexOf(direction)]
			for (let i = 1; i <= amount; i++) {
				x = x + movement[0];
				y = y + movement[1];
				
				const key = `${x}-${y}` as Key;
				if (positions.has(key)) selfIntersections += 1;
				positions.set(key, positions.size + selfIntersections);
			}
		}

		let closest: number = Infinity;
		for (const [position, steps] of positions) {
			if (!oldPositions.has(position)) continue;
			const val = oldPositions.get(position)!;
			closest = Math.min(closest, val + steps);
		}

		allClosest = Math.min(allClosest, closest);
		oldPositions = positions;
	}

	return allClosest;
}