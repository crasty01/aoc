type Map = {
	src: number;
	dist: number;
	len: number;
}
type Input = {
	seeds: Array<number>;
	maps: Array<Array<Map>>
};

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
	const regexNumbers = new RegExp(/\d+/g);
	const [seed_raw, ...maps_raw] = rawInut.replace(/\r\n/g, '\n').split('\n\n');
	const seeds = seed_raw.match(regexNumbers)!.map(e => parseInt(e, 10));
	const maps = maps_raw.map(map_raw => {
		const [_, ...lines] = map_raw.split('\n');
		return lines.map(line => {
			const [dist, src, len] = line.match(regexNumbers)!.map(e => parseInt(e, 10));
			return { dist, src, len };
		}).sort((a, b) => a.src - b.src);
	});

	return {
		seeds,
		maps,
	}
}

const applyMap = (input: number, maps: Array<Map>) => {
	const map = maps.find(map => map.src <= input && map.src + map.len > input);
	if (!map) return input;
	return input + map.dist - map.src;
}

solutions[0] = (input: Input): number | string => {
	let min = Infinity;

	for (const seed of input.seeds) {
		let currentValue = seed;
		for (const maps of input.maps) {
			const newValue = applyMap(currentValue, maps);
			currentValue = newValue;
		}
		min = Math.min(min, currentValue)
	}

	return min;
}

type Range = [number, number];
const applyMapAdvanced = (_ranges: Array<Range>, maps: Array<Map>): Array<Range> => {
	const ranges: Array<Range> = _ranges.map(([a, b]) => [a, b]) // copy;
	const output: Array<Range> = [];

	for (const map of maps) {
		const mapStart = map.src;
		const mapEnd = map.src + map.len - 1;
		const diff = map.dist - map.src;

		for (let i = 0; i < ranges.length; i++) {
			const rangeStart = ranges[i][0];
			const rangeEnd = ranges[i][1];
			if (mapEnd < rangeStart || mapStart > rangeEnd) continue;

			const includesRangeStart = rangeStart >= mapStart;
			const includesRangeEnd = rangeEnd <= mapEnd;

			const situation = (includesRangeStart ? 1 : 0) | ((includesRangeEnd ? 1 : 0) << 1);

			switch (situation) {
				case 0:
					ranges[i][1] = mapStart - 1;
					ranges.push([mapEnd + 1, rangeEnd]);
					output.push([mapStart + diff, mapEnd + diff]);
					break;
				case 1:
					ranges[i][0] = mapEnd + 1;
					output.push([rangeStart + diff, mapEnd + diff]);
					break;
				case 2:
					ranges[i][1] = mapStart - 1;
					output.push([mapStart + diff, rangeEnd + diff]);
					break;
				case 3:
					ranges[i] = [-1, -1];
					output.push([rangeStart + diff, rangeEnd + diff]);
					break;
	
				default:
					throw new Error("BAD SITUATION");
			}
		}
	}

	for (let i = 0; i < ranges.length; i++) {
		if (ranges[i][0] !== -1 && ranges[i][1] !== -1) {
			output.push([ranges[i][0], ranges[i][1]]);
		}
	}

	return output;
}

solutions[1] = (input: Input): number | string => {
	let min = Infinity;

	for (let i = 0; i < input.seeds.length; i += 2) {
		let ranges: Array<Range> = [[input.seeds[i], input.seeds[i] + input.seeds[i + 1] - 1]];

		for (const map of input.maps) {
			ranges = applyMapAdvanced(ranges, map);
		}

		min = Math.min(min, ...ranges.map(e => e[0]))
	}

	return min;
}

// old naive approach:

// solutions[1] = (input: Input, run = false): number | string => {
// 	// if (!run) return 0;
// 	let min = Infinity;

// 	for (let i = 0; i < input.seeds.length; i += 2) {
// 		for (let j = 0; j < input.seeds[i + 1]; j++) {
// 			let currentValue = input.seeds[i] + j;
// 			for (const maps of input.maps) {
// 				const newValue = applyMap(currentValue, maps);
// 				currentValue = newValue;
// 			}
// 			min = Math.min(min, currentValue)
// 		}
// 	}

// 	return min;
// }