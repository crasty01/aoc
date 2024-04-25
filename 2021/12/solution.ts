type Input = Record<string, Set<string>>;

const step = (caves: Input, filter: (e: string, mem: Array<string>) => boolean, mem: Array<string> = ['start']) => {
  const current = mem[mem.length - 1];
  if (current === 'end') return [mem]
  const f: Array<Array<string>> = [];
  const paths = [...caves[current]].filter(e => filter(e, mem));
  for (let i = 0; i < paths.length; i++) {
    const r = step(caves, filter, [...mem, paths[i]])
    f.push(...r)
  }
  return f;
}

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  const caves: Input = {};
  rawInut.split('\r\n').map(e => e.split('-')).forEach(([a, b]) => {
    if (!caves[a]) caves[a] = new Set()
    if (!caves[b]) caves[b] = new Set()
    caves[a].add(b)
    caves[b].add(a)
  })
  return caves;
}

solutions[0] = (input: Input): number | string =>  {
  return step(
    input,
    (e, mem) => !mem.includes(e) || e.toUpperCase() === e
  ).length;
}

solutions[1] = (input: Input): number | string =>  {
  return step(
    input,
    (e, mem) => {
      if (e.toUpperCase() === e) return true;
      if (e === 'end') return true;
      if (e === 'start') return false;

      const small_only = mem.filter(e => e.toLowerCase() === e)
      const o: Record<string, number> = {};
      for (let i = 0; i < small_only.length; i++) {
        if (!o[small_only[i]]) o[small_only[i]] = 0;
        o[small_only[i]]++
      }
      const bt1 = Object.values(o).filter(f => f > 1).length
      if (bt1 === 0) return true

      return !mem.includes(e);
    }
  ).length;
}