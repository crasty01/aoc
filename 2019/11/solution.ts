import { intcode, type PartialContext } from "/2019/intcode.ts";

type Input = Array<number>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split(',').map(e => parseInt(e, 10));
}

solutions[0] = (memory: Input, run = false): number =>  {
	const ctx: PartialContext = {
		inputs: [],
		memory,
	}
	const robot = intcode(ctx);
	const map = new Map<string, number>();
	const acc: Array<[number, number]> = [[0, -1], [1, 0], [0, 1], [-1, 0]]; // 'up', 'right', 'down', 'left'

	let done = false;
	let x = 0;
	let y = 0;
	let dir = 0;

	while (!done) {
		const currentColor = map.get(`${x},${y}`) ?? 0;
		ctx.inputs.push(currentColor);
		const response = robot.next();

		if (response.done) {
			done = true;
		} else {
			map.set(`${x},${y}`, response.value);
			const movement = robot.next();
			if (movement.value === undefined) throw new Error("UNDEFINED MOVEMENT");
			
			dir = (dir + (movement.value === 0 ? -1 : 1) + acc.length) % acc.length;
			x = x + acc[dir][0];
			y = y + acc[dir][1];
		}
	}

  return map.size;
}

solutions[1] = (memory: Input, run = false): number =>  {
	const ctx: PartialContext = {
		inputs: [],
		memory,
	}
	const robot = intcode(ctx);
	const map = new Map<string, number>([[`0,0`, 1]]);
	const acc: Array<[number, number]> = [[0, -1], [1, 0], [0, 1], [-1, 0]]; // 'up', 'right', 'down', 'left'

	let done = false;
	let x = 0;
	let y = 0;
	let dir = 0;

	let xMin = 0;
	let xMax = 0;
	let yMin = 0;
	let yMax = 0;

	while (!done) {
		const currentColor = map.get(`${x},${y}`) ?? 0;
		ctx.inputs.push(currentColor);
		const response = robot.next();

		if (response.done) {
			done = true;
		} else {
			map.set(`${x},${y}`, response.value);
			const movement = robot.next();
			if (movement.value === undefined) throw new Error("UNDEFINED MOVEMENT");
			
			dir = (dir + (movement.value === 0 ? -1 : 1) + acc.length) % acc.length;
			x = x + acc[dir][0];
			y = y + acc[dir][1];

			xMin = Math.min(xMin, x);
			xMax = Math.max(xMax, x);
			yMin = Math.min(yMin, y);
			yMax = Math.max(yMax, y);
		}
	}

	for (let y = yMin; y <= yMax; y++) {
		let s = '';
		for (let x = xMin; x <= xMax; x++) {
			const value = map.get(`${x},${y}`);
			s += value === 0 ? '⬛' : value === 1 ? '⬜' : '🟥';
		}
		console.log(s);
	}

  return 0;
}