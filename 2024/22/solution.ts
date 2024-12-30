type Input = Array<number>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split(/\r?\n/g).map(e => parseInt(e, 10));
}

const PRUNE_CONSTANT = 16777216;
const mix = (secret: number, value: number) => secret ^ value;
const prune = (secret: number) => secret % PRUNE_CONSTANT + (secret < 0 ? PRUNE_CONSTANT : 0);

const SHIFT = 9;
const pack = (a: number, b: number, c: number, d: number) => 
	((a + SHIFT) & 0b11111) << 15 | 
	((b + SHIFT) & 0b11111) << 10 | 
	((c + SHIFT) & 0b11111) << 5  | 
	((d + SHIFT) & 0b11111);
const unpack = (packed: number) => [
	(packed & 0b11111) - SHIFT,
	((packed >> 5) & 0b11111) - SHIFT,
	((packed >> 10) & 0b11111) - SHIFT,
	((packed >> 15) & 0b11111) - SHIFT,
];

solutions[0] = (input: Input, run = false): number => {
	function* createSecrets (seed: number) {
		let secret = seed;
		do {
			secret = prune(mix(secret, secret * 64));
			secret = prune(mix(secret, Math.floor(secret / 32)));
			secret = prune(mix(secret, secret * 2048));
			yield secret;
		} while (true);
	}

	let sum = 0;
	for (const secret of input) {
		const result = createSecrets(secret).drop(2000 - 1).next();
		sum += result.done ? 0 : result.value;
	}
  return sum;
}

solutions[1] = (input: Input, run = false): number => {
	const MAX_ITER = 2_000;
	const maps = input.map(() => new Map<number, number>());
	const keys = new Set<number>();
	function* createPrice (seed: number) {
		let secret = seed;
		do {
			secret = prune(mix(secret, secret * 64));
			secret = prune(mix(secret, Math.floor(secret / 32)));
			secret = prune(mix(secret, secret * 2048));
			yield secret % 10;
		} while (true);
	}

	for (let i = 0; i < input.length; i++) {
		const map = maps[i];
		let c0: number | undefined = 0;
		let c1: number | undefined = 0;
		let c2: number | undefined = 0;
		let c3: number | undefined = 0;
		let last = 0;

		for (const [index, price] of createPrice(input[i]).take(MAX_ITER).map((e, i) => [i, e])) {
			const diff = price - last;
			if (diff + SHIFT > 18 || diff + SHIFT < 0) throw new Error("ERROR");

			[c0, c1, c2, c3] = [c1, c2, c3, diff];
			last = price;

			if (index < 3) continue;

			const key = pack(c0, c1, c2, c3);
			keys.add(key);
			if (!map.has(key)) {
				map.set(key, price);
			}
		}
	}

	let highest = 0;
	for (const key of keys) {
		let sum = 0;
		for (let i = 0; i < maps.length; i++) {
			sum += maps[i].get(key) ?? 0;
		}
		highest = highest > sum ? highest : sum;
	}

  return highest;
}