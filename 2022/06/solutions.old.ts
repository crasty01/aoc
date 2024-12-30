type Input = string;

export const simpleSolution = (input: Input, CHARS: number): number | string => {
  const unique = (input: string): boolean => input.length === new Set([...input]).size;

  let last = input.slice(0, CHARS - 1);
  for (let i = CHARS - 1; i < input.length; i++) {
    last = last.slice(-1 * (CHARS - 1)) + input[i];
    if (unique(last)) return i + 1;
  }
  return -1;
}

export const fasterSolution = (input: Input, CHARS: number): number | string => {
  for (let i = CHARS - 1; i < input.length; i++) {
    const set = new Set();
    for (let j = 0; j < CHARS; j++) {
      if (set.has(input[i - j])) break;
      set.add(input[i - j]);
    }
    if (set.size === CHARS) return i + 1;
  }
  return -1;
}