type Input = Array<number>; 

const nextDay = (m: Array<number>): Array<number> => {
  const a = [...m.slice(1), m[0]]
  a[6] += a[8]
  return a
}

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split(',').map(Number);
}

solutions[0] = (input: Input): number | string => {
  const END_DAY = 80;
  let m = [...Array(9).fill(0)];

  for (const l of input) m[l] += 1;
  for (let day = 0; day < END_DAY; day++) m = nextDay(m);

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += m[i];

  return sum;
}

solutions[1] = (input: Input): number | string => {
  const END_DAY = 256;
  let m = [...Array(9).fill(0)];

  for (const l of input) m[l] += 1;
  for (let day = 0; day < END_DAY; day++) m = nextDay(m);

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += m[i];

  return sum;
}