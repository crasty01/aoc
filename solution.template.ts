type Input = any;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut;
}

solutions[0] = (input: Input, run = false): number => {
  if (!run) return -1;
  return 0;
}

solutions[1] = (input: Input, run = false): number => {
  if (!run) return -1;
  return 0;
}

const example = ``;

export const runExamples = () => {
	for (let i = 0; i < solutions.length; i++) {
		console.log(`example[${i}]:`, solutions[i](parseInput(example), true))
	}
}