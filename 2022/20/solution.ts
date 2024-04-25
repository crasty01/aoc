type Input = Array<number>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split('\r\n').map((line) =>  parseInt(line, 10));
}

const getNewIndex = (currentIndex: number, value: number, length: number): number => {
  if (value === 0) return currentIndex;
  switch (Math.sign(value)) {
    case -1: return (currentIndex + value + length) % length;
    case 0: return currentIndex;
    case 1: return (currentIndex + value + length) % length;
    default: throw new Error('Invalid value');
  }
}

const mix = (input: Input): Array<number> => {
  const array = input.map((value) => [value, false]) as Array<[number, boolean]>;
  const n = array.length;
  let currentIndex = 0;

  for (let i = 0; i < n; i++) {
    const [value] = array.splice(currentIndex, 1)[0];
    const newIndex = getNewIndex(currentIndex, value, array.length)

    // console.log(`Move ${value} from ${currentIndex} to ${newIndex}`);
    // console.log({ currentIndex, value, newIndex });
    array.splice(newIndex, 0, [value, true]);
    currentIndex = array.findIndex((line) => line[1] === false);
    // console.log(input.map((line) => line[0]));
  }

  return array.map((line) => line[0]);
}

const getSum = (input: Array<number>): number => {
  const zeroIndex = input.findIndex((line) => line === 0);
  const a = getNewIndex(zeroIndex, 1000, input.length);
  const b = getNewIndex(a, 1000, input.length);
  const c = getNewIndex(b, 1000, input.length);
  // console.log(input[a], input[b], input[c]);
  return input[a] + input[b] + input[c];
}

solutions[0] = (input: Input): number =>  {
  const mixed = mix(input);
  return getSum(mixed);
}

solutions[1] = (input: Input, run = false): number =>  {
  if (!run) return -1;
  let mixed = input.map((value) => value * 811589153);
  // console.log(mixed);
  
  for (let i = 0; i < 10; i++) {
    mixed = mix(mixed);
    // console.log(mixed);
  }
  return getSum(mixed);
}

// const example = `1\r\n2\r\n-3\r\n3\r\n-2\r\n0\r\n4`;
// console.log('Example 1:', solutions[0](parseInput(example)));
// console.log('Example 2:', solutions[1](parseInput(example), true));