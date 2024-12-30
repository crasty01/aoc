import { resolve } from "@std/path/resolve";

type Input = Array<string>;
type Keypad = Array<Array<string | null>>;

const numpad: Readonly<Keypad> = [['7','8','9'],['4','5','6'],['1','2','3'],[null,'0','A']];
const arrowkeys: Readonly<Keypad> = [[null,'^','A'],['<','v','>']];
export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split(/\r?\n/g);
}

const createMap = (configuration: Readonly<Keypad>) => {
	const map = new Map<string, [number, number]>();
	for (let y = 0; y < configuration.length; y++) {
		for (let x = 0; x < configuration[0].length; x++) {
			const symbol = configuration[y][x];
			if (symbol === null) continue; 
			map.set(symbol, [x, y])
		}
	}

	return map;
}

const pairing = (input: string) => {
	const path = [];

	for (let i = 0; i < input.length; i++) {
		path.push([input[i - 1], input[1]]);
	}

	return path;
}

const createPath = (keypads: Array<Readonly<Keypad>>) => {
	const maps = keypads.map(keypad => createMap(keypad));
	// const memo = new Map<string, string>();

	const tracker = (from: string, to: string, index: number): string => {
		console.log(from, to, index)
		if (index === maps.length) {
			return (from ?? '') + to;
		}
		const map = maps[index];

		const posFrom = map.get(from ?? 'A')!;
		const posTo = map.get(to)!;

		const diffX = posTo[0] - posFrom[0];
		const diffY = posTo[1] - posFrom[1];

		const aString = (diffX > 0 ? '>' : '<').repeat(Math.abs(diffX)) + (diffY > 0 ? 'v' : '^').repeat(Math.abs(diffY)) + 'A';
		const bString = (diffY > 0 ? 'v' : '^').repeat(Math.abs(diffY)) + (diffX > 0 ? '>' : '<').repeat(Math.abs(diffX)) + 'A';

		if (aString !== bString) {
			const a = pairing(aString).map(([f, t]) => tracker(f, t, index + 1)).join('');
			const b = pairing(bString).map(([f, t]) => tracker(f, t, index + 1)).join('');

			return a.length > b.length ? b : a;
		} else {
			return pairing(aString).map(([f, t]) => tracker(f, t, index + 1)).join('')
		}
		

	}

	return tracker;
}

/*

+---+---+---+
| 7 | 8 | 9 |
+---+---+---+
| 4 | 5 | 6 |
+---+---+---+
| 1 | 2 | 3 |
+---+---+---+
    | 0 | A |
    +---+---+



    +---+---+
    | ^ | A |
+---+---+---+
| < | v | > |
+---+---+---+

*/

solutions[0] = (input: Input, run = false): number => {
  if (!run) return -1;

	const path = createPath([numpad, arrowkeys]);

	console.log('result:', path('A', '0', 0));

	return 0;
}

solutions[1] = (input: Input, run = false): number => {
  if (!run) return -1;
  return 0;
}

const example = `029A
980A
179A
456A
379A`;

console.log('result:', solutions[0](parseInput(example), true));