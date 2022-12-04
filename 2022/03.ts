type Input = Array<string>;

const getPriority = (char: string) => {
  const charCode = char.charCodeAt(0);
  return charCode > 90 ? charCode - 96 : charCode - 38;
}

export const parseInput = (rawInut: string): Input => {
  return rawInut.replace(/\r\n/g, "\n").split("\n");
};

export const solution1 = (input: Input): number | string => {
  let s = 0;
  for (const line of input) {
    const half = Math.floor(line.length / 2);
    const [left, right] = [line.slice(0, half), line.slice(half)];

    let found = undefined;

    for (const char of left) {
      if (!right.includes(char)) continue;
      found = char;
      break;
    }

    if (!found) continue;
    s += getPriority(found);
  }
  return s;
};

export const solution2 = (input: Input): number | string => {
  const GROUP_SIZE = 3;
  let sum = 0;
  for (let i = 0; i < input.length / GROUP_SIZE; i++) {
    const elves = input.slice(i * GROUP_SIZE, (i * GROUP_SIZE) + GROUP_SIZE);
    for (const char of elves[0]) {
      if (elves[1].includes(char) && elves[2].includes(char)) {
        sum += getPriority(char);
        break;
      }
    }
  }
  return sum;
};
