type Input = any;

export const parseInput = (rawInut: string): Input => {
  return rawInut;
}

export const solution1 = (input: Input, run = false): number =>  {
  if (!run) return -1;
  return 0;
}

export const solution2 = (input: Input, run = false): number =>  {
  if (!run) return -1;
  return 0;
}

const example = `1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9`

console.log('example:', solution1(parseInput(example), true));