type Input = string;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut;
}

solutions[0] = (input: Input, run = false): number => {
	const regex = /mul\((?<a>-?\d{1,3}),(?<b>-?\d{1,3})\)/;
	const matches = input.match(new RegExp(regex, 'g'))!;

	let sum = 0;
	for (let i = 0; i < matches.length; i++) {
		const res = regex.exec(matches[i]);
		sum += +(res?.groups?.a ?? '0') * +(res?.groups?.b ?? '0')
	}

  return sum;
}

solutions[1] = (input: Input, run = false): number => {
	const regex = /(?<type>(mul)|(do)|(don\'t))\(((?<a>-?\d{1,3}),(?<b>-?\d{1,3}))?\)/;
	const matches = input.match(new RegExp(regex, 'g'))!;

	let sum = 0;
	let enabled = true;
	for (let i = 0; i < matches.length; i++) {
		const groups = regex.exec(matches[i])!.groups!;
		switch (groups.type) {
			case 'mul':
				sum += (+(groups?.a ?? '0') * +(groups?.b ?? '0') * +enabled);
				break;
			case 'do':
				enabled = true;
				break;
			case 'don\'t':
				enabled = false;
				break;
			default: throw new Error("UNKNOWN TYPE");
		}
	}

  return sum;
}
