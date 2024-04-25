type Input = any;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut;
}

solutions[0] = (input: Input, run = false): number =>  {
  if (!run) return -1;
  return 0;
}

solutions[1] = (input: Input, run = false): number =>  {
  if (!run) return -1;
  return 0;
}

// const example = `1,0,1~1,2,1
// 0,0,2~2,0,2
// 0,2,3~2,2,3
// 0,0,4~0,2,4
// 2,0,5~2,2,5
// 0,1,6~2,1,6
// 1,1,8~1,1,9`

// console.log('example:', solutions[0](parseInput(example), true));