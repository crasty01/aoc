type Input = Array<Pos>;
type Pos = {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}; 

const REGEX = /^(?<x1>\d+),(?<y1>\d+) -> (?<x2>\d+),(?<y2>\d+)$/;

const getPointsDiagonal = (x1: number, x2: number, y1: number, y2: number): Array<string> => {
  const points = [];

  if(Math.abs(y1 - y2) !== Math.abs(x1 - x2)) throw new Error("Wrong diagonal, not 45deg");
  
  for (let i = 0; i <= Math.abs(y2 - y1); i++) {
    points.push(`${x1 + (x2 - x1 > 0 ? i : -i)}-${y1 + (y2 - y1 > 0 ? i : -i)}`)
  }
  return points;
}
const getPointsHorizontal = (x: number, y1: number, y2: number): Array<string> => {
  const points = [];
  // console.log(y1, y2)
  if (y2 - y1 < 0) [y1, y2] = [y2, y1];
  // console.log(y1, y2)

  for (let y = y1; y <= y2; y++) {
    points.push(`${x}-${y}`)
  }
  return points;
}
const getPointsVertical = (y: number, x1: number, x2: number): Array<string> => {
  const points = [];
  // console.log(x1, x2)
  if (x2 - x1 < 0) [x1, x2] = [x2, x1];
  // console.log(x1, x2)
  for (let x = x1; x <= x2; x++) {
    points.push(`${x}-${y}`)
  }
  return points;
}

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  const input = rawInut.split('\r\n').filter(e => {
    return REGEX.test(e)
  }).map(e => {
    const groups = e.match(REGEX)?.groups;
    if (!groups) {
      // console.log(e, groups)
      throw new Error("wrong input");
    }
    const { x1, y1, x2, y2 } = groups;
    return {
      x1: Number(x1),
      x2: Number(x2),
      y1: Number(y1),
      y2: Number(y2),
    } as Pos;
  });
  
  return input;
}

solutions[0] = (input: Input): number | string =>  {
  const crossed: { [key: string]: number } = {};

  for (const line of input) {
    if (line.x1 === line.x2) {
      const points = getPointsHorizontal(line.x1, line.y1, line.y2)
      for (const point of points) {
        if (!(point in crossed)) crossed[point] = 0;
        crossed[point] = crossed[point] + 1;
      }
    }
    if (line.y1 === line.y2) {
      const points = getPointsVertical(line.y1, line.x1, line.x2)
      for (const point of points) {
        if (!(point in crossed)) crossed[point] = 0;
        crossed[point] = crossed[point] + 1;
      }

    }
  }

  return Object.entries(crossed).reduce((acc, e) => e[1] >= 2 ? acc + 1 : acc, 0);
}

solutions[1] = (input: Input): number | string =>  {
  const crossed: { [key: string]: number } = {};

  for (const line of input) {
    if (line.x1 === line.x2) {
      const points = getPointsHorizontal(line.x1, line.y1, line.y2)
      for (const point of points) {
        if (!(point in crossed)) crossed[point] = 0;
        crossed[point] = crossed[point] + 1;
      }
    }
    else if (line.y1 === line.y2) {
      const points = getPointsVertical(line.y1, line.x1, line.x2)
      for (const point of points) {
        if (!(point in crossed)) crossed[point] = 0;
        crossed[point] = crossed[point] + 1;
      }
    }
    else {
      const points = getPointsDiagonal(line.x1, line.x2, line.y1, line.y2)
      for (const point of points) {
        if (!(point in crossed)) crossed[point] = 0;
        crossed[point] = crossed[point] + 1;
      }
    }
  }
  return Object.entries(crossed).reduce((acc, e) => e[1] >= 2 ? acc + 1 : acc, 0);
}