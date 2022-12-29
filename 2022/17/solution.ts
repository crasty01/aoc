type Pos = { x: number, y: number };
type State = false | 'WallCollision' | 'FloorCollision' | 'RockCollision';
type Input = string;

export const parseInput = (rawInut: string): Input => {
  return rawInut;
}

const rockTypes = [
  '..####.',
  '...#.....###.....#...',
  '....#......#....###..',
  '..#......#......#......#....',
  '..##.....##...',
];

const drawSettledRocks = (settledRock: Set<string>, currentRock: Set<string>, highestRock: number, WIDTH: number): void => {
  for (let i = highestRock + 2; i >= 0; i--) {
    let row = '|';
    for (let j = 0; j < WIDTH; j++) {
      const pos = `${j},${i}`;
      if (currentRock.has(pos)) row += '@';
      else if (settledRock.has(pos)) row += '#';
      else row += '.';
    }
    row += '|'
    console.log(row);
  }

  console.log('+' + ''.padStart(WIDTH, '-') + '+');
}

const copyRock = (rock: Array<Pos>): Array<Pos> => {
  const newRock = [];
  for (const { x, y } of rock) {
    newRock.push({ x, y });
  }
  return newRock;
}

const generateRock = (rock: string, heightOffset: number, WIDTH: number): Array<Pos> => {
  const rockPositions = [];
  const height = Math.floor(rock.length / WIDTH) - 1;
  for (let i = 0; i < rock.length; i++) {
    if (rock[i] === '#') {
      const x = i % WIDTH;
      const y = height - Math.floor(i / WIDTH) + heightOffset;
      rockPositions.push({ x, y });
    }
  }
  return rockPositions;
}

const moveRock = (rock: Array<Pos>, direction: 'down' | 'left' | 'right'): Array<Pos> => {
  return rock.map(pos => {
    switch (direction) {
      case 'down': return { x: pos.x, y: pos.y - 1 };
      case 'left': return { x: pos.x - 1, y: pos.y };
      case 'right': return { x: pos.x + 1, y: pos.y };
    }
  });
}

const collisionDetected = (rock: Array<Pos>, settledRock: Set<string>, WIDTH: number): State => {
  for (const pos of rock) {
    if (pos.y < 0) return 'FloorCollision';
    if (pos.x < 0 || pos.x >= WIDTH) return 'WallCollision';
    if (settledRock.has(`${pos.x},${pos.y}`)) return 'RockCollision';
  }
  return false;
}

const solution = (input: Input, rocksToFall: number): number | string =>  {
  // console.log('----------')
  const settledRock = new Set<string>();
  const WIDTH = 7;
  const HEIGHT_OFFSET = 4;

  let highestRock = -1;
  let jet = 0;
  
  for (let i = 0; i < rocksToFall; i++) {
    let rock = generateRock(rockTypes[i % rockTypes.length], highestRock + HEIGHT_OFFSET, WIDTH);
    let settled = false;

    while (!settled) {
      // drawSettledRocks(settledRock, new Set(rock.map(({ x, y }) => `${x},${y}`)), highestRock + 4, WIDTH);
      // console.log();
      const newRock = copyRock(rock);
      const movedRockHorizontal = moveRock(newRock, input[jet++ % input.length] === '>' ? 'right' : 'left');
      const collisionAfterHorizontalMove = collisionDetected(movedRockHorizontal, settledRock, WIDTH);
      
      rock = copyRock(collisionAfterHorizontalMove === false ? movedRockHorizontal : rock);
      const movedRockDown = moveRock(rock, 'down');
      const collisionAfterDownMove = collisionDetected(movedRockDown, settledRock, WIDTH);

      if (collisionAfterDownMove === 'FloorCollision' || collisionAfterDownMove === 'RockCollision') settled = true;
      else rock = movedRockDown;
    }

    for (const pos of rock) {
      settledRock.add(`${pos.x},${pos.y}`);
      highestRock = Math.max(highestRock, pos.y);
    }

    // clean up settled rocks more than 10 rows below the highest rock
    for (const pos of settledRock) {
      const [, y] = pos.split(',').map(e => parseInt(e, 10));
      if (y < highestRock - 10) settledRock.delete(pos);
    }
  }


  return highestRock + 1;
}

export const solution1 = (input: Input): number | string =>  {
  return solution(input, 2022)
}

export const solution2 = (input: Input): number | string =>  {
  // return solution(input, 1000000000000)
  return -1
}

// const example = `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`;
// console.log(solution2(parseInput(example)));