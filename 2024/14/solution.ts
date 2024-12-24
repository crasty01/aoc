type Point = [number, number];
type Input = Array<{
	p: [number, number];
	v: [number, number];
}>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
	const regex = /^p=(?<raw_p>-?\d+,-?\d+) v=(?<raw_v>-?\d+,-?\d+)$/;
  return rawInut.split(/\r?\n/g).map(line => {
		const { raw_p, raw_v } = regex.exec(line)!.groups!;

		if (!raw_p || !raw_v) throw new Error(`COULDN'T PARSE LINE: '${line}'`);

		return {
			p: raw_p.split(',').map(e => parseInt(e, 10)) as Point,
			v: raw_v.split(',').map(e => parseInt(e, 10)) as Point,
		};
	});
}

solutions[0] = (input: Input, run = false) => {
	const points = new Map<string, number>();
	const width = 101;
	const height = 103;
	const seconds = 100;
	
	const center = [(width - 1) / 2, (height - 1) / 2];
	if (Math.floor(center[0]) !== center[0] || Math.floor(center[1]) !== center[1]) throw new Error(`NO CENTER POSSIBLE: ( width=${width}, height=${height} )`);
	
	const quadrants = [0, 0, 0, 0];

	for (const { p, v } of input) {
		const x = ((p[0] + (v[0] * seconds)) % width + width) % width;
		const y = ((p[1] + (v[1] * seconds)) % height + height) % height;
		
		const isCenter = x !== center[0] && y !== center[1];
		const q = isCenter ? ((y > center[1] ? 1 : 0) << 1) | (x > center[0] ? 1 : 0) : undefined;
		if (typeof q === 'number') quadrants[q] += 1;

		const key = `${x}^${y}`;
		points.set(key, (points.get(key) ?? 0) + 1);
	}

  return quadrants[0] * quadrants[1] * quadrants[2] * quadrants[3];
}

const createDisplay = (width: number, height: number) => (points: Map<string, number>) => {
	let grid = ''
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			grid += points.has(`${x}^${y}`) ? '■' : ' ';
		}
		grid += '\n';
	}
	console.log(grid);
}

solutions[1] = (input: Input, run = false): number =>  {
	const width = 101;
	const height = 103;
	// const disaply = createDisplay(width, height);
	const MAX_ITER = 100_000;
	
	let soconds = 0;
	let noDuplicate = true;

	while (++soconds <= MAX_ITER) {
		noDuplicate = true;
		const points = new Map<string, number>();

		for (const { p, v } of input) {
			p[0] = (p[0] + v[0] + width) % width;
			p[1] = (p[1] + v[1] + height) % height;
			
			const key = `${p[0]}^${p[1]}`;
			if (points.has(key)) noDuplicate = false;
			points.set(key, (points.get(key) ?? 0) + 1);
		}

		if (noDuplicate) {
			let longestLine = 0;

			for (let y = 0; y < height; y++) {
				for (let x = 0; x < width; x++) {
					let line = 0;

					while (points.has(`${x + line}^${y}`)) {
						line += 1;
					}

					longestLine = Math.max(longestLine, line);
				}
			}

			if (longestLine > 20) {
				// disaply(points);
				// console.log('seconds:', soconds, '\n\n');
				break;
			}

		}
	}

  return soconds;
}