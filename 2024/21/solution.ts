import { permuation } from "./permutations.ts";

type Input = Array<string>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split(/\r?\n/g);
}

const createTranslator = (configs: Array<Array<Array<string | null>>>) => {
	const configurations = configs.map((config, i) => {
		const map = new Map<string, [number, number]>();
		const sequences = new Map<string, Array<string>>();
		for (let y = 0; y < config.length; y++) {
			for (let x = 0; x < config[0].length; x++) {
				const symbol = config[y][x];
				if (symbol === null) continue; 
				map.set(symbol, [x, y])
			}
		}

		return { map, sequences	};
	})

	const sequencer = (index: number, a: string, b: string) => {
		const { sequences, map } = configurations[index];
		const posA = map.get(a)!;
		const posB = map.get(b)!;

		if (!posA || !posB) {
			throw new Error(JSON.stringify({ index, a, b }, null, 2));
			
		}
		
		const diffX = posB[0] - posA[0];
		const diffY = posB[1] - posA[1];

		const key = `${diffX}^${diffY}`;
		if (sequences.has(key)) return sequences.get(key)!; 

		const symbols = (diffY > 0 ? 'v' : '^').repeat(Math.abs(diffY)) + (diffX > 0 ? '>' : '<').repeat(Math.abs(diffX))
		sequences.set(key, permuation(symbols).map(e => e + 'A'));

		return sequences.get(key)!;
	}
	
	return sequencer;
}

const createVerificator = (configurations: Array<Array<Array<string | null>>>) => {
	const POSITIONS = configurations.map(configuration => {
		let pos: undefined | [number, number] = undefined;
		const w = configuration[0].length;
		const h = configuration.length;
		let i = 0;
		while (!pos && i < w * h) {
			const y = Math.floor(i / w);
			const x = i % w;
			if (configuration[y][x] === 'A') {
				pos = [x, y];
			}
			i += 1;
		}

		if (!pos) throw new Error("COULD NOT FIND STARTING POSITION 'A'");
		return pos;
	});

	const DIRECTIONS = {
		'^': [+0, -1],
		'>': [+1, +0],
		'v': [+0, 1],
		'<': [-1, +0],
	} as const;

	type Symbol = keyof typeof DIRECTIONS | 'A';

	return (code: string, path: string) => {
		let a: Array<Symbol> = [];
		let b: Array<Symbol> = [...path] as Array<Symbol>;

		for (let i = configurations.length - 1; i >= 0; i += -1) {
			a = b;
			b = [];

			const config = configurations[i];
			let [x, y] = POSITIONS[i];
			
			for (const symbol of a) {
				if (symbol === 'A') {
					b.push(config[y][x] as Symbol);
				} else {
					const [dx, dy] = DIRECTIONS[symbol];
					x += dx;
					y += dy;
				}
			}

		}

		return b.join('') === code;
	};
}

solutions[0] = (input: Input, run = false): number => {
  if (!run) return -1;
	const dirpad = [
		[null, '^', 'A'],
		[ '<', 'v', '>'],
	];
	const numpad = [
		[ '7', '8', '9'],
		[ '4', '5', '6'],
		[ '1', '2', '3'],
		[null, '0', 'A'],
	];

	const configurations = [numpad, dirpad, dirpad];
	const sequencer = createTranslator(configurations);
	const verificator = createVerificator(configurations);

	const memo = configurations.map(e => '');

	const solveSequence = (_code: string, index = 0): string => {
		
		if (index >= configurations.length) {
			return _code;
		}
		
		let path = ''
		const code = 'A' + _code;
		for (let i = 1; i < code.length; i++) {
			const a = code[i - 1];
			const b = code[i];

			const sequences = sequencer(index, a, b).map(sequence => solveSequence(sequence, index + 1));
			let shortest = sequences[0];

			for (const sequence of sequences) {
				if (shortest.length >= sequence.length) shortest = sequence;
			}

			path += shortest;
		}

		return path;
	}

	let sum = 0;
	for (const code of input) {
		const path = solveSequence(code);
		console.log(`${code}: ${path}`);
		if (!verificator(code, path)) {
			throw new Error("BAD RESULT");
		}
		sum += parseInt(code, 10) * path.length;
	}

  return sum;
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

/*

029A

v<A<AA^>>A<Av>AA^Av<<A^>>AvA^Av<<A^>>AAv<A>A^A<A>Av<A<A^>>AAA<Av>A^A

*/