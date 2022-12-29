type Extreme = { min: number, max: number };
type Extremes = { x: Extreme, y: Extreme, z: Extreme };
type Input = Set<string>; // x,y,z

export const parseInput = (rawInut: string): Input => {
  return new Set(rawInut.split('\r\n'));
}

const getPosition = (pos: string) => {
  const [x, y, z] = pos.split(',');
  return [parseInt(x, 10), parseInt(y, 10), parseInt(z, 10)];
}

const getSurfaceArea = (cubes: Input): number =>  {
  let surfaceArea = 0;

  for (const key of cubes) {
    const [x, y, z] = getPosition(key);
    let toAdd = 6;

    if (cubes.has(`${x - 1},${y},${z}`)) toAdd--;
    if (cubes.has(`${x + 1},${y},${z}`)) toAdd--;
    if (cubes.has(`${x},${y - 1},${z}`)) toAdd--;
    if (cubes.has(`${x},${y + 1},${z}`)) toAdd--;
    if (cubes.has(`${x},${y},${z - 1}`)) toAdd--;
    if (cubes.has(`${x},${y},${z + 1}`)) toAdd--;

    surfaceArea += toAdd;
  }

  return surfaceArea;
}

const findExtremes = (cubes: Input): Extremes => {
  const extremes: Extremes = {
    x: { min: Infinity, max: -Infinity },
    y: { min: Infinity, max: -Infinity },
    z: { min: Infinity, max: -Infinity },
  }
  
  for (const key of cubes) {
    const [x, y, z] = getPosition(key);
    if (x < extremes.x.min) extremes.x.min = x;
    if (x > extremes.x.max) extremes.x.max = x;
    if (y < extremes.y.min) extremes.y.min = y;
    if (y > extremes.y.max) extremes.y.max = y;
    if (z < extremes.z.min) extremes.z.min = z;
    if (z > extremes.z.max) extremes.z.max = z;
  }

  // expand extremes by 1 in all directions
  extremes.x.min += -1;
  extremes.x.max += 1;
  extremes.y.min += -1;
  extremes.y.max += 1;
  extremes.z.min += -1;
  extremes.z.max += 1;

  return extremes;
}

const getSurfaceAreaWithoutAirPockets = (cubes: Input): number =>  {
  const extremes = findExtremes(cubes);
  const queue = [[extremes.x.min, extremes.y.min, extremes.z.min]];
  const air = new Set<string>(queue.map(([x, y, z]) => `${x},${y},${z}`));
  const neighbours = [
    [-1, 0, 0],
    [1, 0, 0],
    [0, -1, 0],
    [0, 1, 0],
    [0, 0, -1],
    [0, 0, 1],
  ];

  while (queue.length > 0) {
    const [x, y, z] = queue.shift()!;

    for (const [dx, dy, dz] of neighbours) {
      const [nx, ny, nz] = [x + dx, y + dy, z + dz];
      const key = `${nx},${ny},${nz}`;

      if (nx < extremes.x.min || nx > extremes.x.max) continue;
      if (ny < extremes.y.min || ny > extremes.y.max) continue;
      if (nz < extremes.z.min || nz > extremes.z.max) continue;
      if (air.has(key) || cubes.has(key)) continue;

      queue.push([nx, ny, nz]);
      air.add(key);
    }
  }

  // calculate surface area of the the extremes
  const xl = extremes.x.max - extremes.x.min + 1;
  const yl = extremes.y.max - extremes.y.min + 1;
  const zl = extremes.z.max - extremes.z.min + 1;
  const surfaceArea = 2 * xl * yl + 2 * xl * zl + 2 * yl * zl;

  return getSurfaceArea(air) - surfaceArea;
}

export const solution1 = (input: Input): number | string =>  {
  return getSurfaceArea(input);
}

export const solution2 = (input: Input): number | string =>  {
  return getSurfaceAreaWithoutAirPockets(input);
}