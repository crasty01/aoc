import { parse } from "@std/path/parse";

type NodeType = '*' | '+';
type Node = {
	type: NodeType;
	lines: Array<string>;
}
type Input = Array<Node>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  const lines = rawInut.split(/\r?\n/g);
	const data: Array<Node> = [];
	const w = lines[0].length;

	let i = 0;
	while (i < w) {
		let j = i;
		while (true) {
			if (j >= w || lines.every(line => line[j] === ' ')) {
				break;
			} else {
				j += 1;
			}
		}
		const selected = lines.map(line => line.slice(i, j));
		data.push({
			lines: selected.slice(0, -1),
			type: selected.at(-1)?.trim() as NodeType,
		});
		i = j + 1;
	}
	return data;
}

solutions[0] = (input: Input, run = false): number => {
	let sum = 0;

	for (const { lines, type } of input) {
		const numbers = lines.map(line => parseInt(line, 10));
		let result = numbers[0];
		for (let i = 1; i < numbers.length; i++) {
			switch (type) {
				case '*':
					result *= numbers[i];
					break;
				case '+':
					result += numbers[i];
					break;
				default:
					throw new Error("UNREACHABLE");
			}
		}
		sum += result;
	}

  return sum;
}

solutions[1] = (input: Input, run = false): number => {
	let sum = 0;

	for (const { lines, type } of input) {
		const numbers = Array.from({ length: lines[0].length }, (_, i) => parseInt(lines.map(line => line.at(-i)).join('').trim(), 10))
		let result = numbers[0];
		for (let i = 1; i < numbers.length; i++) {
			switch (type) {
				case '*':
					result *= numbers[i];
					break;
				case '+':
					result += numbers[i];
					break;
				default:
					throw new Error("UNREACHABLE");
			}
		}
		sum += result;
	}

  return sum;
}

const example = `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `;

for (let i = 0; i < solutions.length; i++) {
	console.log(`solution[${i}]:`, solutions[i](parseInput(example), true))
}