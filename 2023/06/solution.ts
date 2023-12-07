type Input = {
	times: Array<number>;
	distances: Array<number>;
};

export const parseInput = (rawInut: string): Input => {
	const numberRegex = new RegExp(/\d+/g);
  const [time_raw, distance_raw] = rawInut.replace(/\r\n/g, '\n').split('\n');
	const times = time_raw.match(numberRegex)?.map(e => parseInt(e, 10)).filter(e => typeof e === 'number') ?? [];
	const distances = distance_raw.match(numberRegex)?.map(e => parseInt(e, 10)).filter(e => typeof e === 'number') ?? [];

	if (times.length !== distances.length) throw new Error("ARRAY LENGTH MISMATCH");

	return {
		times, distances
	}
}

export const solution1 = (input: Input): number =>  {
	let acc = 1;

	for (let i = 0; i < input.times.length; i++) {
		const time = input.times[i];
		const distance = input.distances[i];

		const halftime = Math.ceil(time / 2);
		let j = Math.ceil(distance / time);
		for (j; j < halftime; j++) {
			if ((time - j) * j > distance) break;
		}

		acc *= time - (2 * j) + 1;
	}

  return acc;
}

export const solution2 = (input: Input): number =>  {
	const time = parseInt(input.times.join(''));
	const distance =  parseInt(input.distances.join(''));

	const halftime = Math.ceil(time / 2);
	let j = Math.ceil(distance / time);
	for (j; j < halftime; j++) {
		if ((time - j) * j > distance) break;
	}

	return time - (2 * j) + 1;
}