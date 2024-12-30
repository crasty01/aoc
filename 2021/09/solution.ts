type Input = Array<Array<number>>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split('\r\n').map(e => e.split('').map(Number));
}

solutions[0] = (input: Input): number | string => {
  const height: number = input.length;
  const width: number = input[0].length;

  const getap = (hp: number, vp: number): number[][] => {
    const ap = [];
    if (hp > 0) ap.push([hp - 1, vp]);
    if (vp > 0) ap.push([hp, vp - 1]);
    if (hp < width - 1) ap.push([hp + 1, vp]);
    if (vp < height - 1) ap.push([hp, vp + 1]);
    return ap;
  }

  let sum = 0;
  for (let vp = 0; vp < height; vp++) {
    for (let hp = 0; hp < width; hp++) {
      const ap = getap(hp, vp);
      if (ap.every(([a, b]) => input[b][a] > input[vp][hp])) {
        sum += input[vp][hp] + 1;
      }
    }
  }

  return sum
}

solutions[1] = (input: Input): number | string => {
  return 0;
}