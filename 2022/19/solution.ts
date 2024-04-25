const types = ['ore', 'clay', 'obsidian', 'geode'] as const;
type Costs = Array<number>;
type Blueprint = Array<Costs>;
type Input = Array<{
  ms: Costs;
  bp: Blueprint;
}>;
type Cache = Map<string, number>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split('\r\n').map((line, lineIndex) => {
    const ms = [0, 0, 0, Infinity];
    const bp = line.split(': ')[1].split('. ').map((bot) => {
      const recipe = [0, 0, 0];
      for (const res of bot.match(/(\d+) (\w+)/g)!) {
        const [_cost, type] = res.split(' ') as [string, typeof types[number]];
        const cost = parseInt(_cost, 10);
        const index = types.indexOf(type);
        recipe[index] = cost;
        ms[index] = Math.max(ms[index], cost);
      }
      return recipe;
    });
    return { ms, bp };
  })
}

const dfs = (
  blueprint: Blueprint,
  maxSpend: Costs,
  cache: Cache,
  time: number,
  bots: Array<number>,
  resources: Array<number>,
): number => {
  if (time <= 0) return resources[3];
  const key = `${time}:${bots.join(',')}:${resources.join(',')}`;
  let max = 0;

  if (cache.has(key)) return cache.get(key)!;

  max = resources[3] + bots[3] * time;

  for (let botType = 0; botType < blueprint.length; botType++) {
    const recipe = blueprint[botType];
    if (botType!= 3 && bots[botType] >= maxSpend[botType]) continue;

    let wait = 0;
    let canMake = true;

    for (let resourceType = 0; resourceType < recipe.length; resourceType++) {
      const resourceAmount = recipe[resourceType];
      if (resourceAmount === 0) continue;
      if (bots[resourceType] === 0) {
        canMake = false;
        break;
      }
      wait = Math.max(wait, Math.ceil((resourceAmount - resources[resourceType]) / bots[resourceType]));
    }

    const remainingTime = time - wait - 1;
    
    if (!canMake || remainingTime <= 0) continue;

    const _bots = [...bots].map((b, i) => b + (i === botType ? 1 : 0));
    const _resources = [...resources]
      .map((r, i) => Math.min(r + bots[i] * (wait + 1) - (recipe[i] ?? 0), maxSpend[i] * remainingTime));
    max = Math.max(max, dfs(blueprint, maxSpend, cache, remainingTime, _bots, _resources));
  }
  cache.set(key, max);
  return max;
}

const solution = (input: Input, time: number): Array<number> =>  {
  return input.map(({ bp, ms }) => dfs(bp, ms, new Map(), time, [1, 0, 0, 0], [0, 0, 0, 0]));
}

solutions[0] = (input: Input): number =>  {
  return solution(input, 24).map((max, i) => max * (i + 1)).reduce((a, b) => a + b, 0);
}

solutions[1] = (input: Input): number =>  {
  return solution(input.slice(0, 3), 32).reduce((a, b) => a * b, 1);
}