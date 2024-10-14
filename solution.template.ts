type Input = any;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split(/\r?\n/g);
}

solutions[0] = (input: Input, run = false): number =>  {
  if (!run) return -1;
  return 0;
}

solutions[1] = (input: Input, run = false): number =>  {
  if (!run) return -1;
  return 0;
}