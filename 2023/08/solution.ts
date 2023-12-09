type Input = {
	instructions: string;
	nodes: Map<string, [string, string]>;
};

export const parseInput = (rawInut: string): Input => {
	const nodeRegex = new RegExp(/^(?<node>\w{3}) = \((?<left>\w{3}), (?<right>\w{3})\)$/);
  const [instructions, network] = rawInut.replace(/\r\n/g, '\n').split('\n\n');
	const nodes = new Map<string, [string, string]>(network.split('\n').map(line => {
		const r = nodeRegex.exec(line);
		if (!r || !r.groups) throw new Error(`FAILED TO PARSE NODE: ${line}`);
		
		return [r.groups.node, [r.groups.left, r.groups.right]];
	}))
	return {
		instructions,
		nodes,
	}
}

export const solution1 = (input: Input): number =>  {
	let currentNode = 'AAA';
	let steps = 0;
	const instructions = [...input.instructions].map(e => Number(e === 'R'));

	while (currentNode !== 'ZZZ') {
		const c = input.nodes.get(currentNode);
		if (!c) throw new Error(`NODE '${currentNode}' NOT FOUND`);

		const instruction = instructions[steps % input.instructions.length];
		currentNode = c[instruction];
		steps += 1;
	}

  return steps;
}

const _lcm = (a: number, b: number) => (a * b) / gcd(a, b)
const gcd = (a: number, b: number): number => (b == 0) ? a : gcd(b, a % b)
const lcm = (list: Array<number>) => list.reduce((acc, n) => _lcm(acc, n));

export const solution2 = (input: Input): number =>  {
	const instructions = [...input.instructions].map(e => Number(e === 'R'));
	const entries = [...input.nodes.entries()];
	const starts = entries.map(([key]) => key).filter((node) => {
		return node.endsWith('A');
	});

	console.log(starts)

	const steps = starts.map(() => 0);
	for (let i = 0; i < starts.length; i++) {
		let currentNode = starts[i];
		let currentSteps = 0;

		while (!currentNode.endsWith('Z')) {
			const c = input.nodes.get(currentNode);
			if (!c) throw new Error(`NODE '${currentNode}' NOT FOUND`);
	
			const instruction = instructions[currentSteps % input.instructions.length];
			currentNode = c[instruction];
			currentSteps += 1;
		}

		steps[i] = currentSteps;
	}

  return lcm(steps)
}