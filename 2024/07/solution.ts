import { combinationsWithReplacement } from "./util.ts";

type OperationSymbol = '+' | '*' | '||';
type Input = {
	length: number;
	lines: Array<Array<number>>;
};

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
	let length = 0;
	const lines = rawInut.split(/\r?\n/).map(line => {
		const l = line.split(/:?\W+/).map(e => parseInt(e, 10))
		length = Math.max(l.length, length);
		return l;
	});

	return { lines, length };
}

const createEquationValidator = (length: number, operations: Array<OperationSymbol>) => {
	const posibilities = Array.from({ length }, (_, i) => combinationsWithReplacement(operations, i));

	return (result: number, numbers: Array<number>): 0 | 1 => {
		const possibleCombinations = posibilities[numbers.length - 1];
		
		for (let i = 0; i < possibleCombinations.length; i++) {
			let sum = numbers[0];
			for (let n = 1; n < numbers.length; n++) {
				switch (possibleCombinations[i][n - 1]) {
					case '*':
						sum *= numbers[n];
						break;
					case '+':
						sum += numbers[n];
						break;
					case '||':
						sum = parseInt(`${sum}${numbers[n]}`, 10);
						break;
					default:
						throw new Error(`UNKNOWN OPERATION (operation = ${possibleCombinations?.[i]?.[n - 1]})`);
				}
			}
			if (sum === result) return 1;
		}

		return 0;
	}
}

solutions[0] = ({ length, lines }: Input, run = false): number =>  {
	const isEquationsValid = createEquationValidator(length, ['*', '+']);

	let sum = 0;
	for (const line of lines) {
		const [result, ...numbers] = line;
		sum += isEquationsValid(result, numbers) * result;
	}

  return sum;
}

solutions[1] = ({ length, lines }: Input, run = false): number =>  {
	const isEquationsValid = createEquationValidator(length, ['*', '+', '||']);

	let sum = 0;
	for (const line of lines) {
		const [result, ...numbers] = line;
		sum += isEquationsValid(result, numbers) * result;
	}

  return sum;
}