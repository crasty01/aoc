type Image = Array<string>;
type Input = Array<Image>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
	return rawInut.split(/\r?\n\r?\n/g).map(image => image.split(/\r?\n/g));
}

const compareHorizontally = (image: Image, exactNumberOfMistakes = 0): number => {
	const width = image[0].length;
	const height = image.length;

	for (let line = 1; line <= width - 1; line++) {
		let mistakes = 0;
		const offset = Math.min(line, width - line);
		 for (let column = line - offset; column < line ; column++) {
			const mirrored = 2 * line - column - 1;
			
			for (let y = 0; y < height; y++) {
				if (image[y][column] !== image[y][mirrored]) {
					mistakes += 1;
				}
			}
		}
		if (mistakes === exactNumberOfMistakes) return line;
	}

	return 0;
}

const compareVertically = (image: Image, exactNumberOfMistakes = 0): number => {
	const width = image[0].length;
	const height = image.length;

	for (let line = 1; line <= height - 1; line++) {
		let mistakes = 0;
		const offset = Math.min(line, height - line);
		 for (let row = line - offset; row < line; row++) {
			const mirrored = 2 * line - row - 1;
			
			for (let x = 0; x < width; x++) {
				if (image[row][x] !== image[mirrored][x]) {
					mistakes += 1;
				}
			}
		}
		if (mistakes === exactNumberOfMistakes) return line;
	}

	return 0;
}

solutions[0] = (input: Input): number => {
	let sum = 0;

	for (const image of input) {
		sum += compareHorizontally(image);
		sum += compareVertically(image) * 100;
	}

  return sum;
}

solutions[1] = (input: Input): number => {
	let sum = 0;

	for (const image of input) {
		sum += compareHorizontally(image, 1);
		sum += compareVertically(image, 1) * 100;
	}

  return sum;
}