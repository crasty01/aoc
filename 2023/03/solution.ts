type Sym = {
	pos: number;
	type: '*' | '#' | '-' | '+' | '@' | '%' | '&' | '=' | '$' | '/';
}
type Num = {
	pos: number;
	value: number;
	length: number;
	used: boolean;
}
type Input = {
	symbols: Array<Sym>;
	content: string;
	width: number;
	numbers: Array<Num>;
	original: string;
};

export const parseInput = (rawInut: string): Input => {
	const width = rawInut.indexOf('\r\n')
  const content = rawInut.replace(/\r\n/g, '');
	const symbols: Array<Sym> = [];
	const numbers: Array<Num> = [];
	const isDot = new RegExp(/^[.]$/);
	const isNumber = new RegExp(/^[\d]$/);
	const isSymbol = new RegExp(/^[^.\d]$/);

	for (let i = 0; i < content.length; i++) {
		const cell = content[i];
		if (isDot.test(cell)) continue;
		if (isNumber.test(cell) && !isNumber.test(content[i - 1])) {
			const number = parseInt(content.slice(i));
			numbers.push({
				pos: i,
				value: number,
				length: (''+number).length,
				used: false,
			});
		}
		if (isSymbol.test(cell)) {
			symbols.push({
				pos: i,
				type: cell as Sym['type'],
			});
		}
	}

	return {
		content,
		width,
		symbols,
		numbers,
		original: rawInut,
	}
}

export const solution1 = (input: Input): number | string =>  {
	let sum = 0;

	for (let i = 0; i < input.symbols.length; i++) {
		for (let dx = -1; dx <= 1; dx++) {
			for (let dy = -1; dy <= 1; dy++) {
				if (dx === 0 && dy === 0) continue;
				const pos = input.symbols[i].pos + (dy * input.width) + dx;

				for (const num of input.numbers) {
					if (num.used) continue;
					if (num.pos <= pos && num.pos + num.length > pos) {
						num.used = true;
						sum += num.value;
					}
				}
			}
		}
	}

	return sum;
}

export const solution2 = (input: Input): number | string =>  {
	let sum = 0;

	for (let i = 0; i < input.symbols.length; i++) {
		if (input.symbols[i].type !== '*') continue;
		const gears = [];

		for (let dx = -1; dx <= 1; dx++) {
			for (let dy = -1; dy <= 1; dy++) {
				if (dx === 0 && dy === 0) continue;
				const pos = input.symbols[i].pos + (dy * input.width) + dx;

				for (const num of input.numbers) {
					if (num.used) continue;
					if (num.pos <= pos && num.pos + num.length > pos) {
						gears.push(num)
						num.used = true;
					}
				}

			}
		}

		if (gears.length === 2) {
			const gearRatio = gears[0].value * gears[1].value;
			sum += gearRatio;
		}
	}

	return sum;
}