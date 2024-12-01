import { Context, intcode, PartialContext } from "/2019/intcode.ts";

type Input = Array<number>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split(',').map(e => parseInt(e, 10));
}

solutions[0] = (memory: Input, run = false): number =>  {
	const game = intcode({
		inputs: [],
		memory,
	});
	
	const map = new Map<string, number>();
	let done = false;
	while (!done) {
		const { value: x, done: doneX } = game.next();
		const { value: y, done: doneY } = game.next();
		const { value: i, done: doneI } = game.next();

		done = !!doneX || !!doneY || !!doneI;

		map.set(`${x},${y}`, i ?? -1);
	}

	let blockTiles = 0;
	for (const [_, value] of map) {
		blockTiles += +(value === 2);
	}

  return blockTiles;
}

solutions[1] = (memory: Input, run = false): number =>  {
	let score = 0;
	memory[0] = 2;

	const ctx: PartialContext = {
		inputs: [],
		memory,
	}
	const game = intcode(ctx);
	
	let player = 0;
	while (true) {
		const { value: x } = game.next();
		const { value: y } = game.next();
		const { value: v } = game.next();

		if (x == undefined || y === undefined || v === undefined) break;

		if (x === -1 && y === 0) {
			score = v
		} 
		
		if (v === 3) {
			player = x;
		}

		if (v === 4) {
			ctx.inputs.push(Math.sign(x - player));
		}
	}

  return score;
}