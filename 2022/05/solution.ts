type Input = { moves: Array<Move>; stack: Stack; };
type Move = { n: number; from: number; to: number; }
type Stack = Array<Array<string | undefined>>;

const rotateArray = <T extends string | number | undefined | boolean>(array: Array<Array<T>>, n = 1) => {
  let matrix = array;
  for (let i = 0; i < n; i++) {
    matrix = matrix[0].map((_, index) => matrix.map(row => row[index]).reverse())
  }
  return matrix;
}

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  const [rawStack, rawMoves] = rawInut.split('\r\n\r\n');
  
  const moves: Array<Move> = rawMoves.split('\r\n').map((text) => {
    const { n, from, to } = /^move (?<n>\d+) from (?<from>\d+) to (?<to>\d+)$/.exec(text)!.groups!
    return {
      n: parseInt(n, 10),
      from: parseInt(from, 10) - 1,
      to: parseInt(to, 10) - 1,
    }
  });

  const stack: Stack = rotateArray(rawStack.split('\r\n').slice(0, -1).map(line => {
    return line.match(/(.){1,4}/g)!.map(part => {
      return /^\[(?<crate>\w+)\]$/g.exec(part.trim())?.groups?.crate;
    });
  })).map(e => e.filter(Boolean));

  return {
    moves,
    stack,
  }
}

solutions[0] = ({ stack, moves }: Input): number | string =>  {
  for (const { from, to, n } of moves) {
    const [f, tmp] = [stack[from].slice(0, -1 * n), stack[from].slice(-1 * n)];
    stack[from] = f;
    stack[to] = [...stack[to], ...tmp.reverse()];
  }
  return stack.map(line => line.at(-1)!).join('');
}

solutions[1] = async ({ stack, moves }: Input): Promise<number | string> =>  {
  for await (const { from, to, n } of moves) {
    const [f, tmp] = [stack[from].slice(0, -1 * n), stack[from].slice(-1 * n)];
    stack[from] = f;
    stack[to] = [...stack[to], ...tmp];
  }
  return stack.map(line => line.at(-1)!).join('');
}