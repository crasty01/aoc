type Input = Array<number>;

export const parseInput = (rawInut: string): Input => {
	const regexNumbers = new RegExp(/\d+/g);
	return rawInut.split('\r\n').map(line => {
		const [_, data] = line.split(': ');
		const [winningNumebrs, chosenNumbers] = data.split(' | ');
		const winning = winningNumebrs.match(regexNumbers)?.map(e => parseInt(e)) ?? [];
		const chosen = chosenNumbers.match(regexNumbers)?.map(e => parseInt(e)) ?? [];

		let matched = 0;
		for (let i = 0; i < winning.length; i++) {
			if (chosen.includes(winning[i])) matched += 1;
		}

		return matched;
	});
}

export const solution1 = (input: Input): number | string =>  {
	let points = 0;
	
	for (const matched of input) {
		points += matched > 0 ? Math.pow(2, matched - 1) : 0;
	}

	return points;
}

export const solution2 = (input: Input): number | string =>  {
	const counted = input.map(() => 1);
	let points = input.length;
	
	for (let i = 0; i < input.length; i++) {
		for (let m = 0; m < input[i]; m++) {
			counted[i + m + 1] += counted[i];
			points += counted[i];
		}
	}

	return points;
}