type Input = {
  polymer_template: string;
  pair_insertion: Map<string, string>
};

const getPairs = (s: string): Record<string, number> => {
  const pairs: Record<string, number> = {};
  for (let i = 0; i < s.length - 1; i++) {
    const pair = s[i] + s[i + 1];
    if (!pairs[pair]) pairs[pair] = 0;
    pairs[pair] += 1;
  }

  return pairs;
};

const solution = (input: Input, STEPS: number, getResult: (a: boolean) => number) => {
  const LAST_CHAR = input.polymer_template.charAt(input.polymer_template.length - 1)
  let pairs = getPairs(input.polymer_template);

  for (let step = 0; step < STEPS; step++) {
    const _pairs: Record<string, number> = {};
    for (const pair of Object.entries(pairs)) {
      const _char = input.pair_insertion.get(pair[0]);
      const _pair_one = pair[0].charAt(0) + _char;
      const _pair_two = _char + pair[0].charAt(1);

      if (!_pairs[_pair_one]) _pairs[_pair_one] = 0;
      if (!_pairs[_pair_two]) _pairs[_pair_two] = 0;

      _pairs[_pair_one] += pair[1];
      _pairs[_pair_two] += pair[1];
    }
    pairs = _pairs;
  }

  const chars: Record<string, number> = {};

  for (const pair of Object.entries(pairs)) {
    if (!chars[pair[0][0]]) chars[pair[0][0]] = 0;
    chars[pair[0][0]] += pair[1];
  }

  const _chars = Object.entries(chars).sort((a, b) => b[1] - a[1])
  const [max, min] = [_chars[0], _chars[_chars.length - 1]];
  return max[1] - min[1] + getResult(max[0] === LAST_CHAR)
}

export const parseInput = (rawInut: string): Input => {
  const [template, pair] = rawInut.split('\r\n\r\n')
  return {
    polymer_template: template,
    pair_insertion: new Map(pair.split('\r\n').map(f => {
      const [a, b] = f.split(' -> ')
      return [a, b]
    })) as Map<string, string>
  }
}

export const solution1 = (input: Input): number | string =>  {
  return solution(input, 10, (a => a ? 0 : -1));
}

export const solution2 = (input: Input): number | string =>  {
  return solution(input, 40, (a => a ? 1 : -1));
}