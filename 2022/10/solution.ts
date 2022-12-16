import { assertEquals } from 'std/testing/asserts.ts';
import BitArray from './BitArray.ts';

type OperationType = 'addx' | 'noop';
type OperationAddx = {
  type: 'addx';
  value: number;
}
type OperationNoop = {
  type: 'noop';
};
type Input = Array<OperationAddx | OperationNoop>;

export const parseInput = (rawInut: string): Input => {
  return rawInut.split('\r\n').map((line) => {
    const [type, value] = line.split(' ') as [OperationType, string | undefined];
    if (type === 'addx') return {
      type: 'addx',
      value: value && parseInt(value, 10),
    } as OperationAddx;

    if (type === 'noop') return {
      type: 'noop',
    } as OperationNoop;

    throw new Error(`Unknown operation type: ${type}`);
  });
}

const noop = (accumulator: number): number => {
  return accumulator;
}

const addx = (accumulator: number, value: number): number => {
  return accumulator + value;
}

const solution = function* (input: Input) {
  let accumulator = 1;
  for (const operation of input) {
    // console.log(operation);
    switch (operation.type) {
      case 'noop':
        accumulator = noop(accumulator);
        yield accumulator;
        break;
      case 'addx':
        yield accumulator;
        accumulator = addx(accumulator, operation.value);
        yield accumulator;
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  }
  return;
}

export const solution1 = (input: Input): number =>  {
  const SKIP = 20;

  let cycle = 1;
  let sum = 0;
  let nextBreak = SKIP;

  const generator = solution(input);

  while (true) {
    cycle += 1;

    const { value, done } = generator.next();
    if (done) break;

    if (cycle >= nextBreak) {
      const newValue = cycle * value;
      sum += newValue;
      nextBreak += SKIP * 2;
    }
  }
  return sum;
}

export const solution2 = (input: Input): string => {
  const WIDTH = 40;
  const HEIGHT = 6;
  const bitArray = new BitArray(WIDTH * HEIGHT);

  let cycle = 0;
  let previous = 1;

  const generator = solution(input);

  while (true) {
    if (Math.abs((cycle % WIDTH) - previous) <= 1) bitArray.set(cycle, 1);

    const { value, done } = generator.next();
    if (done) break;

    previous = value;
    cycle += 1;
  }

  let acc = '';

  for (let i = 0; i < HEIGHT; i++) {
    for (let j = 0; j < WIDTH; j++) {
      const value = bitArray.get(i * WIDTH + j);
      acc += value ? '█' : '.';
    }
    acc += '\n';
  }

  return acc;
}
