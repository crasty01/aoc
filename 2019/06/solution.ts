type Input = Array<[string ,string]>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split(/\r?\n/).map(e => e.split(')') as [string, string]);
}

solutions[0] = (input: Input, run = false): number =>  {	
	const map = new Map<string, Array<string>>();

	for (const [center, body] of input) {
		if (!map.has(center)) map.set(center, []);
		map.get(center)!.push(body);
	}

	let coutner = 0;
	const queue: Array<[string, number]> = [['COM', 0]];

	while (queue.length > 0) {
		const [center, level] = queue.shift()!;
		const children = map.get(center);
		coutner += level;
		if (!children) continue;
		queue.push(...children.map(e => [e, level + 1] as [string, number]));
	}

  return coutner;
}

solutions[1] = (input: Input, run = false): number =>  {
	const nodes = new Map<string, string>();

	for (const [a, b] of input) {		
		nodes.set(b, a);
	}

	const path: Array<string> = [];
	let current = 'SAN';
	while (current !== 'COM') {
		const parent = nodes.get(current);
		if (!parent) throw new Error(`NO PARENT FOUND: ${current}`);
		path.push(parent);
		current = parent;
	}

	let n = 0;
	current = 'YOU';
	while (current !== 'COM') {
		const parent = nodes.get(current);
		if (!parent) throw new Error(`NO PARENT FOUND: ${current}`);
		const index = path.indexOf(parent);
		if (index !== -1) {
			return n + index;
		}
		n += 1;
		current = parent;
	}

	throw new Error(`NO PATH FOUND`);
}
