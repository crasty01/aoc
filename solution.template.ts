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

for (let i = 0; i < solutions.length; i++) {
	console.log(`solution[${i}]:`, solutions[i](parseInput(example), true))
}