type Input = string;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut;
}

solutions[0] = (input: Input, run = false): number =>  {
	const w = 25;
	const h = 6;
	const s = w * h;
	const length = input.length / s;
	const layers = Array.from({ length }, (_, l) => {
		const digits = Array.from({ length: 10 }, () => 0);
		for (let i = l * s; i < (l + 1) * s; i++) {
			digits[+input[i]] += 1;
		}
		return digits;
	})
	
	let fewest0Index = 0;
	for (let i = 1; i < layers.length; i++) {
		if (layers[fewest0Index][0] > layers[i][0]) {
			fewest0Index = i;
		}
	}

  return layers[fewest0Index][1] * layers[fewest0Index][2]
}

solutions[1] = (input: Input, run = false): number =>  {
	const w = 25;
	const h = 6;
	const s = w * h;
	const length = input.length / s;
	const layers = Array.from({ length }, (_, l) => input.slice(l*s, (l+1)*s));

	let set = 0;
	const finalImage = Array.from({ length: s }, () => '2');
	for (let i = 0; i < length && set < finalImage.length; i++) {
		for (let j = 0; j < layers[i].length; j++) {
			if (layers[i][j] !== '2' && finalImage[j] === '2') {
				finalImage[j] = layers[i][j];
				set += 1;
			}
		}
	}

	for (let y = 0; y < h; y++) {
		let row = '';
		for (let x = 0; x < w; x++) {
			const e = finalImage[y * w + x];
			row += e === '0' ? '⬛' : e === '1' ? '⬜' : '🟥';
		}
		console.log(row);
	}

	return 0
}