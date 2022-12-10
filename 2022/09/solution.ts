type Direction = 'U' | 'D' | 'L' | 'R';
type Input = Array<[Direction, number]>;
type Pos = {
  x: number;
  y: number;
}
/*

  +y ^
     |  +x
  <--+-->
-x   |
     v -y

*/
const getNewHeadPos = ({ x, y }: Pos, dir: Direction, l: number) => {
  const a = dir === 'D' || dir === 'L' ? -1 : 1;
  switch (dir) {
    case 'D':
    case 'U':
      return { x, y: y + (l * a) };
    case 'L':
    case 'R':
      return { x: x + (l * a), y };
    default:
      throw new Error("Undefined behavior");
  }
}

export const parseInput = (rawInut: string): Input => {
  return rawInut.split('\r\n').map((line) => {
    const [direction, length] = line.split(' ');
    return [direction, parseInt(length, 10)];
  });
}

export const solution1 = (input: Input): number | string =>  {
  const tailsUsed = new Set();
  let headPos: Pos = {
    x: 0,
    y: 0,
  };
  const tailPos: Pos = {
    x: 0,
    y: 0,
  };
  for (const line of input) {
    headPos = getNewHeadPos({...headPos}, line[0], line[1])
  }
  return 0;
}

export const solution2 = (input: Input): number | string =>  {
  return 0;
}