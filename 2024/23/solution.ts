type Input = Array<[string, string]>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split(/\r?\n/g).map(e => e.split('-') as [string, string]);
}

solutions[0] = (input: Input, run = false): number => {
	const connections = new Map<string, Array<string>>();

	for (const [a, b] of input) {
		if (!connections.has(a)) connections.set(a, []);
		if (!connections.has(b)) connections.set(b, []);
		connections.get(a)!.push(b);
		connections.get(b)!.push(a);
	}

	const visited = new Set<string>();
	let sum = 0;

	for (const computer of connections.keys()) {
		visited.add(computer);
		const friends = connections.get(computer)!;

		for (let i = 0; i < friends.length; i++) {
			for (let j = i + 1; j < friends.length; j++) {
				const a = friends[i];
				const b = friends[j];

				if (!connections.get(a)!.includes(b)) continue;
				if (!computer.startsWith('t') && !a.startsWith('t') && !b.startsWith('t')) continue;
				if (visited.has(a) || visited.has(b)) continue;

				sum += 1;
			}
		}
	}

	return sum;
}

solutions[1] = (input: Input, run = false): number | string => {
	// if (!run) return -1;
	const connections = new Map<string, Set<string>>();

	for (const [a, b] of input) {
		if (!connections.has(a)) connections.set(a, new Set());
		if (!connections.has(b)) connections.set(b, new Set());
		connections.get(a)!.add(b);
		connections.get(b)!.add(a);
	}
	
	let largest: Array<string> = [];
	// let MAX_ITER = 30;

	const connect = (valid: Array<string>, pool: Set<string>) => {
		// console.log(valid, pool.size);
		if (valid.length + pool.size < largest.length) return;
		if (largest.length < valid.length) largest = valid;

		// if (--MAX_ITER <= 0) return;

		for (const friend of pool) {
			const friendConnections = connections.get(friend)!;
			if (!valid.every(v => friendConnections.has(v))) continue;

			connect([...valid, friend], pool.intersection(friendConnections));
		}
	}

	for (const computer of connections.keys()) {
		connect([computer], connections.get(computer)!)
	}

	return largest.sort().join(',');
}

const example = `kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn`;

console.log('result:', solutions[1](parseInput(example), true));