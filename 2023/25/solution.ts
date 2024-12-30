type Input = Graph;

class Graph {
	#g: Map<string, Map<string, number>>;

	constructor() {
		this.#g = new Map();
	}

	set(a: string, b: string, v = 1) {
		if (!this.#g.has(a)) this.#g.set(a, new Map());
		this.#g.get(a)!.set(b, v);
	}

	get(a: string, b: string) {
		return this.#g.get(a)?.get(b);
	}

	has(a: string, b: string) {
		return this.#g.has(a) && this.#g.get(a)?.has(b);
	}

	keys() {
		return this.#g.keys();
	}

	getParents(s: string) {
		const parent = new Map<string, null | string>();
		for (const node of this.#g.keys()) {
			parent.set(node, null);
		}
		parent.set(s, s);

		const queue: Array<string> = [s];

		while (queue.length > 0) {
			const node = queue.shift()!;

			const connections = this.#g.get(node)!;
			for (const [neighbor, capacity] of connections) {
				if (capacity > 0 && parent.get(neighbor) === null) {
					parent.set(neighbor, node);
					queue.push(neighbor);
				}
			}
		}

		return parent;
	}

	private reset() {
		for (const [key, connections] of this.#g) {
			for (const [connection, _] of connections) {
				this.set(key, connection, 1);
				// this.set(connection, key, 1);
			}
		}
	}

	minCut(s: string, t: string) {
		this.reset();
		let maxFlow = 0;
		let parents = this.getParents(s);
		// console.log('parents:', parents);

		while(parents.get(t) !== null) {
			let flow = Infinity;
			let n = t;

			while (n !== s) {
				const p = parents.get(n)!;
				const f = this.get(p, n) ?? Infinity;
				flow = Math.min(flow, f);
				n = p;
			}

			maxFlow += flow;

			let v = t;
			while (v !== s) {
				const u = parents.get(v)!;
				this.set(u, v, this.get(u, v)! - flow);
				this.set(v, u, this.get(v, u)! + flow);
				v = u;
			}

			// get updated parents
			parents = this.getParents(s);
		}

		return {
			parents,
			flow: maxFlow,
		};
	}
	
	get size() {
		return this.#g.size
	}
}

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  const lines = rawInut.trim().split(/\r?\n/g);
	const graph = new Graph();

	for (const line of lines) {
		const [key, ...nodes] = line.split(/\W+/g);
		for (const node of nodes) {
			graph.set(key, node);
			graph.set(node, key);
		}
	}

	return graph;
}

solutions[0] = (input: Input): number => {
	const [s, ...others] = input.keys();
	for (const t of others) {
		const result = input.minCut(s, t)
		if (result.flow === 3) {
			const defiend = [...result.parents.values()].filter(e => e !== null).length;
			return defiend * (input.size - defiend);
		}
	}

  return -1;
}

solutions[1] = (input: Input, run = false): number => {
  if (!run) return -1;

	const [s, ...others] = input.keys();
	for (const t of others) {
		const result = input.minCut(s, t)
		if (result.flow === 3) {
			const defiend = [...result.parents.values()].filter(e => e !== null).length;
			return defiend * (input.size - defiend);
		}
	}

  return -1;
}

const example = `jqt: rhn xhk nvd
rsh: frs pzl lsr
xhk: hfx
cmg: qnr nvd lhk bvb
rhn: xhk bvb hfx
bvb: xhk hfx
pzl: lsr hfx nvd
qnr: nvd
ntq: jqt hfx bvb xhk
nvd: lhk
lsr: lhk
rzs: qnr cmg lsr rsh
frs: qnr lhk lsr`;

console.log(solutions[0](parseInput(example), true));