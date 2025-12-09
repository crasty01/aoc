type Point = {
	x: number;
	y: number;
	z: number;
};
type Input = Array<Point>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split(/\r?\n/g).map(line => {
		const [x, y, z] = line.split(',').map(e => parseInt(e, 10));
		if (x === undefined || y === undefined || z === undefined) {
			console.log(line, { x, y, z });
			throw new Error("INCORECT POSITION");
		}
		return { x, y, z };
	});
}

const calculateDistancePower = (A: Point, B: Point) => Math.sqrt(Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2) + Math.pow(A.z - B.z, 2));

solutions[0] = (input: Input, run = false): number => {
	const distances: Array<[number, number, number]> = []
	
	for (let i = 0; i < input.length; i++) {
		const A = input[i];
		for (let j = i + 1; j < input.length; j++) {
			const B = input[j];
			distances.push([i, j, calculateDistancePower(A, B)]);
		}
	}

	distances.sort((a, b) => a[2] - b[2]);
	
	const mapToCircuit: Array<number | undefined> = Array.from({ length: input.length }, () => undefined);
	const circutes: Array<Set<number>> = [];
	
	let connections = 0;

	while (connections < input.length) {
		const [a, b] = distances[connections];
		connections += 1;

		const ca = mapToCircuit[a];
		const cb = mapToCircuit[b];

		if (ca === undefined && cb === undefined) {
			mapToCircuit[a] = circutes.length;
			mapToCircuit[b] = circutes.length;
			circutes.push(new Set([a, b]));
		} else if (ca === undefined && cb !== undefined) {
			mapToCircuit[a] = cb;
			circutes[cb].add(a);
		} else if (cb === undefined && ca !== undefined) {
			mapToCircuit[b] = ca;
			circutes[ca].add(b);
		} else if (ca !== cb && ca !== undefined && cb !== undefined) {
			for (const e of circutes[cb]) {
				mapToCircuit[e] = ca;
			}
			circutes[ca] = new Set([...circutes[ca], ...circutes[cb]]);
			circutes[cb].clear();
		}		
	}

	const sizes = circutes.map(set => set.size).sort((a, b) => b - a);
  return (sizes[0] || 1) * (sizes[1] || 1) * (sizes[2] || 1);
}

solutions[1] = (input: Input, run = false): number => {
	const distances: Array<[number, number, number]> = []
	
	for (let i = 0; i < input.length; i++) {
		const A = input[i];
		for (let j = i + 1; j < input.length; j++) {
			const B = input[j];
			distances.push([i, j, calculateDistancePower(A, B)]);
		}
	}

	distances.sort((a, b) => a[2] - b[2]);
	
	const mapToCircuit: Array<number | undefined> = Array.from({ length: input.length }, () => undefined);
	const circutes: Array<Set<number>> = [];
	
	let connections = 0;
	let numberOfCircutes = 0;

	while (connections < distances.length) {
		const [a, b] = distances[connections];
		connections += 1;

		const ca = mapToCircuit[a];
		const cb = mapToCircuit[b];

		if (ca === undefined && cb === undefined) {
			mapToCircuit[a] = circutes.length;
			mapToCircuit[b] = circutes.length;
			circutes.push(new Set([a, b]));
			numberOfCircutes += 1;
		} else if (ca === undefined && cb !== undefined) {
			mapToCircuit[a] = cb;
			circutes[cb].add(a);
		} else if (cb === undefined && ca !== undefined) {
			mapToCircuit[b] = ca;
			circutes[ca].add(b);
		} else if (ca !== cb && ca !== undefined && cb !== undefined) {
			for (const e of circutes[cb]) {
				mapToCircuit[e] = ca;
			}
			circutes[ca] = new Set([...circutes[ca], ...circutes[cb]]);
			circutes[cb].clear();
			numberOfCircutes += -1;
		}

		if (numberOfCircutes === 1 && mapToCircuit.every(e => e !== undefined)) {
			break;
		}
	}

	const [a, b] = distances[connections - 1];
  return input[a].x * input[b].x;
}

const example = `162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`;


export const runExamples = () => {
	for (let i = 0; i < solutions.length; i++) {
		console.log(`example[${i}]:`, solutions[i](parseInput(example), true))
	}
}