type Input = Array<number>; 

export const parseInput = (rawInut: string): Input => {
  return rawInut.split('\n').map(Number);
}

export const solution1 = (input: Input): number | string =>  {
  let count = 0;
  let currentInput = input[0];
  for (let i = 1; i < input.length; i++) {
    if (currentInput < input[i]) count++;
    currentInput = input[i];
  }

  return count;
}

export const solution2 = (input: Input): number | string =>  {
  let count = 0;
  for (let i = 2; i < input.length; i++) {
    const current = input[i - 2] + input[i - 1] + input[i];
    const next = input[i - 1] + input[i] + input[i + 1];
    if (current < next) count++
  }

  return count;
}