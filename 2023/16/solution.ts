type Input = Array<string>;

export const parseInput = (rawInut: string): Input => {
  return rawInut.replace(/\r/, '').split('\n');
}

const FROM_LEFT = 0 as const;
const FROM_TOP = 1 as const;
const FROM_RIGHT = 2 as const;
const FROM_BOTTOM = 3 as const;

type Dir = typeof FROM_LEFT | typeof FROM_TOP | typeof FROM_RIGHT | typeof FROM_BOTTOM;
type Key = `${number}-${number}-${Dir}`;
type KeyWithDir = `${number}-${number}`;
type Laser = {
	readonly x: number;
	readonly y: number;
	readonly dir: Dir,
}

const handleMovement = (tile: string, current: Laser) => {
	const queue: Array<Laser> = [];

	switch (tile) {
		case '.':
			queue.push({
				dir: current.dir,
				x: current.dir === FROM_RIGHT ? current.x - 1 : current.dir === FROM_LEFT ? current.x + 1 : current.x,
				y: current.dir === FROM_BOTTOM ? current.y - 1 : current.dir === FROM_TOP ? current.y + 1 : current.y,
			});
			break;
		case '/':
			switch (current.dir) {
				case FROM_TOP:
					queue.push({
						x: current.x - 1,
						y: current.y,
						dir: FROM_RIGHT,
					});
					break;
				case FROM_RIGHT:
					queue.push({
						x: current.x,
						y: current.y + 1,
						dir: FROM_TOP,
					});
					break;
				case FROM_BOTTOM:
					queue.push({
						x: current.x + 1,
						y: current.y,
						dir: FROM_LEFT,
					});
					break;
				case FROM_LEFT:
					queue.push({
						x: current.x,
						y: current.y - 1,
						dir: FROM_BOTTOM,
					});
					break;
			
				default: throw new Error("UNEXPECTED DIRECTION");
				
			}
			break;
		case '\\':
			switch (current.dir) {
				case FROM_TOP:
					queue.push({
						x: current.x + 1,
						y: current.y,
						dir: FROM_LEFT,
					});
					break;
				case FROM_RIGHT:
					queue.push({
						x: current.x,
						y: current.y - 1,
						dir: FROM_BOTTOM,
					});
					break;
				case FROM_BOTTOM:
					queue.push({
						x: current.x - 1,
						y: current.y,
						dir: FROM_RIGHT,
					});
					break;
				case FROM_LEFT:
					queue.push({
						x: current.x,
						y: current.y + 1,
						dir: FROM_TOP,
					});
					break;
			
				default: throw new Error("UNEXPECTED DIRECTION");
				
			}
			break;
		case '|':
			switch (current.dir) {
				case FROM_TOP:
					queue.push({
						x: current.x,
						y: current.y + 1,
						dir: FROM_TOP,
					});
					break;
				case FROM_BOTTOM:
					queue.push({
						x: current.x,
						y: current.y - 1,
						dir: FROM_BOTTOM,
					});
					break;
				case FROM_LEFT:
				case FROM_RIGHT:
					queue.push({
						x: current.x,
						y: current.y - 1,
						dir: FROM_BOTTOM,
					});
					queue.push({
						x: current.x,
						y: current.y + 1,
						dir: FROM_TOP,
					});
					break;
			
				default: throw new Error("UNEXPECTED DIRECTION");
				
			}
			break;
		case '-':
			switch (current.dir) {
				case FROM_LEFT:
					queue.push({
						x: current.x + 1,
						y: current.y,
						dir: FROM_LEFT,
					});
					break;
				case FROM_RIGHT:
					queue.push({
						x: current.x - 1,
						y: current.y,
						dir: FROM_RIGHT,
					});
					break;
				case FROM_TOP:
				case FROM_BOTTOM:
					queue.push({
						x: current.x + 1,
						y: current.y,
						dir: FROM_LEFT,
					});
					queue.push({
						x: current.x - 1,
						y: current.y,
						dir: FROM_RIGHT,
					});
					break;
			
				default: throw new Error("UNEXPECTED DIRECTION");
				
			}
			break;

		default: throw new Error("UNEXPECTED TILE"); 
	}

	return queue;
}

const solveForDirection = (input: Input, directions: Array<Laser>) => {
	const usedTiles = new Set<Key>();
	const usedTilesWithDir = new Set<KeyWithDir>();
	const queue: Array<Laser> = [...directions];

	while (queue.length > 0) {
		const current = queue.shift();
		if (!current) throw new Error("NO QUEUE ELEMENT FOUND!");

		if (current.x >= input[0].length || current.x < 0 || current.y >= input.length || current.y < 0) continue;

		const key = `${current.x}-${current.y}}` as Key;
		const keyWithDir = `${current.x}-${current.y}-${current.dir}` as KeyWithDir;
		if (usedTilesWithDir.has(keyWithDir)) continue;

		usedTilesWithDir.add(keyWithDir);
		usedTiles.add(key);
		
		const newPositions = handleMovement(input[current.y][current.x], current);
		queue.push(...newPositions);
	}

  return usedTiles.size;
}

export const solution1 = (input: Input): number =>  {
  return solveForDirection(input, [{
		x: 0,
		y: 0,
		dir: FROM_LEFT,
	}]);
}

export const solution2 = (input: Input): number =>  {
	let max = 0;

	for (let i = 0; i < input.length; i++) {
		max = Math.max(
			max,
			solveForDirection(input, [{
				x: 0,
				y: i,
				dir: FROM_LEFT,
			}]),
			solveForDirection(input, [{
				x: input[0].length,
				y: i,
				dir: FROM_RIGHT,
			}]),
		)
	}

	for (let i = 0; i < input[0].length; i++) {
		max = Math.max(
			max,
			solveForDirection(input, [{
				x: i,
				y: 0,
				dir: FROM_TOP,
			}]),
			solveForDirection(input, [{
				x: i,
				y: input.length - 1,
				dir: FROM_BOTTOM,
			}]),
		)
	}

  return max;
}