type Operation = (oldValue: bigint) => bigint;
type Items = Array<bigint>;
type Test = (value: bigint) => number;
type Input = Array<{
  items: Items;
  operation: Operation;
  test: Test;
  inspected: number;
  index: number;
  divisor: bigint;
}>;

const getOperation = (line: string): Operation => {
  const { op, value: _value } = /Operation: new = old (?<op>[\+\-\*\/]) (?<value>(\d+)|(old))/.exec(line)?.groups!;
  const value = _value === 'old' ? null : BigInt(parseInt(_value, 10));

  switch (op) {
    case '+': return (oldValue) => oldValue + (value ?? oldValue);
    case '-': return (oldValue) => oldValue - (value ?? oldValue);
    case '*': return (oldValue) => oldValue * (value ?? oldValue);
    case '/': return (oldValue) => oldValue / (value ?? oldValue);
    default: throw new Error('Invalid operation');
  }
}

const getItems = (line: string): Items => {
  const { items } = /Starting items: (?<items>(\d+(, )?)+)/.exec(line)?.groups!;
  return items.split(', ').map((item) => BigInt(parseInt(item, 10)));
}

const getTest = (line: string, lineTrue: string, lineFalse: string): [bigint, Test] => {
  const { n: _n } = /Test: divisible by (?<n>\d+)/.exec(line)?.groups ?? {};
  const { index: _trueIndex } = /If true: throw to monkey (?<index>\d+)/.exec(lineTrue)?.groups ?? {};
  const { index: _falseIndex } = /If false: throw to monkey (?<index>\d+)/.exec(lineFalse)?.groups ?? {};

  if (!_n || !_trueIndex || !_falseIndex) throw new Error('Invalid test');

  const n = BigInt(parseInt(_n, 10));
  const trueIndex = parseInt(_trueIndex, 10);
  const falseIndex = parseInt(_falseIndex, 10);
  
  return [n, (value) => value % n === 0n ? trueIndex : falseIndex];
}

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split('\r\n\r\n').map((monkey, index) => {
    const [ _, items, operation, _test, testTrue, testFalse ] = monkey.split('\n').map(e => e.trim());
    const [divisor, test] = getTest(_test, testTrue, testFalse);
    return {
      index,
      inspected: 0,
      items: getItems(items),
      operation: getOperation(operation),
      test,
      divisor,
    };
  });
}

const solution = (monkeys: Input, ROUNDS: number, lowerNumber: (value: bigint) => bigint): number | string => {
  for (let round = 0; round < ROUNDS; round++) {
    for (const monkey of monkeys) {
      while (monkey.items.length > 0) {

        const itemWorryLevel = monkey.items.shift()!;
        const newItemWorryLevel = lowerNumber(monkey.operation(itemWorryLevel));
        const newMonkeyIndex = monkey.test(newItemWorryLevel);
        monkeys[newMonkeyIndex].items.push(newItemWorryLevel);
        monkey.inspected += 1;
      }
    }
  }

  const [ monkey1, monkey2 ] = monkeys.sort((a, b) => (b.inspected - a.inspected) > 0n ? 1 : -1).slice(0, 2);
  return monkey1.inspected * monkey2.inspected;
}

solutions[0] = (input: Input): number | string => {
  const lowerNumber = (value: bigint): bigint => value / 3n;
  return solution(input, 20, lowerNumber);
}

solutions[1] = (input: Input): number | string => {
  const lazyCommonDivisor = input.reduce((acc, monkey) => acc * monkey.divisor, 1n);
  const lowerNumber = (value: bigint): bigint => value % lazyCommonDivisor;
  return solution(input, 10000, lowerNumber);
}