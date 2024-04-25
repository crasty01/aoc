type Input = Array<string>;

const p1 = (char: string): number => {
  switch (char) {
    case ")": return 3;
    case "]": return 57;
    case "}": return 1197;
    case ">": return 25137;
    default: return 0;
  }
};

const p2 = (char: string): number => {
  switch (char) {
    case ")": return 1;
    case "]": return 2;
    case "}": return 3;
    case ">": return 4;
    default: return 0;
  }
};
const r = (char: string) => {
  switch (char) {
    case "(": return ")";
    case "[": return "]";
    case "{": return "}";
    case "<": return ">";
  }
};

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split("\r\n");
};

solutions[0] = (input: Input): number | string => {
  let sum = 0;
  for (const line of input) {
    let l = line;
    let i = -1;
    let found = false;
    let notBroken = false;
    do {
      i = l.search(/(\(|\[|\{|\<)(\)|\]|\}|\>)/);
      const eq = r(l[i]) === l[i + 1];

      if (i < 0) notBroken = true;
      if (eq && i >= 0) l = l.substring(0, i) + l.substring(i + 2);
      if (!eq && i >= 0) found = true;
    } while (!(found || notBroken));
    if (found) sum = sum + p1(l[i + 1]);
  }
  return sum;
};

solutions[1] = (input: Input): number | string => {
  const scores = [];
  for (const line of input) {
    let l = line;
    let i = -1;
    let found = false;
    let incomplete = false;
    do {
      i = l.search(/(\(|\[|\{|\<)(\)|\]|\}|\>)/);
      const eq = r(l[i]) === l[i + 1];

      if (eq && i >= 0) l = l.substring(0, i) + l.substring(i + 2);
      if (!eq && i >= 0) found = true;
      if (i < 0) incomplete = true;
    } while (!(found || incomplete));
    if (incomplete) {
      scores.push(l
          .split("")
          .reverse()
          .map((e) => p2(r(e)!))
          .reduce((acc, e) => acc * 5 + e),
      );
    }
  }
  // console.log(scores)
  return scores.sort((a, b) => a - b)[Math.floor(scores.length / 2)];
};
