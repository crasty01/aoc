type ItemArray = Array<number | ItemArray>;
type ItemNumber = number;
type Item = ItemArray | ItemNumber;
type Pair = [Array<Item>, Array<Item>];
type Input = Array<Pair>;

export const parseInput = (rawInut: string): Input => {
  const pairs = rawInut.split('\r\n\r\n');
  return pairs.map((pair) => {
    const [a, b] = pair.split('\r\n');
    return [JSON.parse(a), JSON.parse(b)];
  });
}

const getType = (item: Item): 1 | 0 => {
  if (typeof item === 'number') return 1;
  if (Array.isArray(item)) return 0;
  throw new Error('Unknown type');
};

const compareNumbers = (a: number, b: number): -1 | 0 | 1 => {
  // console.log('comparing numbers');
  // console.log(`${a} ${b}`)
  return Math.sign(a - b) as -1 | 0 | 1;
}
const compareArrays = (a: Array<Item>, b: Array<Item>): -1 | 0 | 1 => {
  // console.log('comparing arrays');
  // console.log(`${JSON.stringify(a)}\n${JSON.stringify(b)}`)

  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    const result = compare(a[i], b[i]);
    if (result !== 0) return result;
  }
  // console.log('finished comparing')
  return Math.sign(a.length - b.length) as -1 | 0 | 1;
}

const compare = (a: Item, b: Item): -1 | 0 | 1 => {
  const types = parseInt(`${getType(a)}${getType(b)}`, 2);
  switch (types) {
    case 0b00: return compareArrays(a as ItemArray, b as ItemArray); // both arrays
    case 0b01: return compareArrays(a as ItemArray, [b] as ItemArray); // a is array, b is number
    case 0b10: return compareArrays([a] as ItemArray, b as ItemArray); // a is number, b is array
    case 0b11: return compareNumbers(a as ItemNumber, b as ItemNumber); // both numbers
    default: throw new Error('Unknown type');
  }
}


export const solution1 = (input: Input): number | string =>  {
  let numberOfPairsInRightOrder = 0;

  for (let index = 0; index < input.length; index++) {
    const [a, b] = input[index];
    const result = compare(a, b);
    if (result === 0) continue;
    if (result === -1) numberOfPairsInRightOrder += index + 1;
  }

  return numberOfPairsInRightOrder;
}

export const solution2 = (input: Input): number | string =>  {
  const dividerPackets = [[[2]], [[6]]];
  const list: Array<Item> = [...dividerPackets];
  for (let index = 0; index < input.length; index++) {
    const [a, b] = input[index];
    list.push(a);
    list.push(b);
  }

  let result = 1;
  const strings = list.sort((a, b) => compare(a, b)).map((item) => JSON.stringify(item));
  const dividerPacketsAsStrings = dividerPackets.map((item) => JSON.stringify(item));

  for (let i = 0; i < dividerPacketsAsStrings.length; i++) {
    result *= strings.indexOf(dividerPacketsAsStrings[i]) + 1;
  }

  return result;
}