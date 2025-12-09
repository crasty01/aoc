type Input = Array<Array<number>>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split(/\r?\n/g).map(line => line.split('').map(e => parseInt(e, 10)));
}

const selectBatteries = (bank: Array<number>, length: number) => {
	let selected = Array.from({ length }, () => 0);
	for (let i = 0; i < bank.length; i++) {
		const n = bank[i];

		for (let i = 0; i < selected.length - 1; i++) {
			if (selected[i + 1] > selected[i]) {
				selected = [...selected.slice(0, i), ...selected.slice(i + 1), n];
				break;
			}
		}

		if (n > selected[selected.length - 1]) {
			selected[selected.length - 1] = n;
		}
	}
	
	return parseInt(selected.join(''));
}

// solutions[0] = (input: Input, run = false): number => {
// 	let sum = 0;
// 	for (const bank of input) {
// 		let first = bank[0];
// 		let second = 0;
// 		for (let i = 1; i < bank.length; i++) {
// 			const n = bank[i];
// 			if (second > first) {
// 				first = second;
// 				second = n;
// 			} else if (n > second) {
// 				second = n;
// 			}
// 		}

// 		sum += first * 10 + second;
// 	}
//   return sum;
// }

solutions[0] = (input: Input, run = false): number => {
	let sum = 0;
	for (const bank of input) {
		sum += selectBatteries(bank, 2);
	}
  return sum;
}

solutions[1] = (input: Input, run = false): number => {
	let sum = 0;
	for (const bank of input) {
		sum += selectBatteries(bank, 12);
	}
  return sum;
}
