type Input = Array<string>; 

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split('\r\n').map(e => e.split(' ').join(''));
}

solutions[0] = (input: Input): number | string => {
  let score = 0;
  const getScore = new Map([
    ['AX', 3 + 1],
    ['AY', 6 + 2],
    ['AZ', 0 + 3],
    ['BX', 0 + 1],
    ['BY', 3 + 2],
    ['BZ', 6 + 3],
    ['CX', 6 + 1],
    ['CY', 0 + 2],
    ['CZ', 3 + 3],
  ]);

  for (let i = 0; i < input.length; i++) {
    const result = getScore.get(input[i]);
    if (!result) throw new Error("Undefined result!");
    score += result;
  }

  return score;
}

solutions[1] = (input: Input): number | string => {
  let score = 0;
  const getScore = new Map([
    ['AX', 0 + 3],
    ['AY', 3 + 1],
    ['AZ', 6 + 2],
    ['BX', 0 + 1],
    ['BY', 3 + 2],
    ['BZ', 6 + 3],
    ['CX', 0 + 2],
    ['CY', 3 + 3],
    ['CZ', 6 + 1],
  ]);

  for (let i = 0; i < input.length; i++) {
    const result = getScore.get(input[i]);
    if (!result) throw new Error("Undefined result!");
    score += result;
  }

  return score;
}