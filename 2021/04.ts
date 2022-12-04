type Input = Array<string>; 
declare type Board = Array<Array<Array<number | boolean>>>;

const sumLeft = (board: Board): number => {
  let sum = 0;
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (!board[y][x][1]) sum += Number(board[y][x][0]);
    }
  }
  return sum;
}
const checkOn = (board: Board, x: number, y: number): boolean => {
  let v = 0, h = 0;
  for (let i = 0; i < board.length; i++) {
    if (board[i][x][1]) v++;
    if (board[y][i][1]) h++;
  }
  return v === board.length || h === board[0].length;
}
const find = (board: Board, n: number) => {
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (board[y][x][0] === n) return [y, x];
    }
  }
  throw new Error("number not found");
  
}

export const parseInput = (rawInut: string): Input => {
  return rawInut.replace(/\r\n/g, '\n').split('\n\n');
}

export const solution1 = (input: Input): number | string =>  {
  const [numbers_raw, ...games_raw] = input
  const numbers = numbers_raw.split(',').map(Number);
  const games = games_raw.map(e => ({
    board: e.split('\n').map(f => f.replace(/ +/g, ' ').trim().split(' ').map(g => ([+g, false]))),
    nSteps: 0,
  }))
  
  for (const game of games) {
    const board: Board = game.board;
    let found = false;
    let i = 0;
    for (i = 0; i < numbers.length && !found; i++) {
      try {
        const [y, x] = find(board, numbers[i]);
        board[y][x][1] = true;
        found = checkOn(board, x, y)
      } catch (error) {
        //console.error(error)
      }
    }
    game.nSteps = --i;
  }
  const winner_game = games.reduce((acc, e) => e.nSteps < acc.nSteps ? e : acc);

  return numbers[winner_game.nSteps] * sumLeft(winner_game.board);
}

export const solution2 = (input: Input): number | string =>  {
  const [numbers_raw, ...games_raw] = input
  const numbers = numbers_raw.split(',').map(Number);
  const games = games_raw.map(e => ({
    board: e.split('\n').map(f => f.replace(/ +/g, ' ').trim().split(' ').map(g => ([+g, false]))),
    nSteps: 0,
  }))

  for (const game of games) {
    const board: Board = game.board;
    let found = false;
    let i = 0;
    for (i = 0; i < numbers.length && !found; i++) {
      try {
        const [y, x] = find(board, numbers[i]);
        board[y][x][1] = true;
        found = checkOn(board, x, y)
      } catch (error) {
        //console.error(error)
      }
    }
    game.nSteps = --i;
  }

  const winner_game = games.reduce((acc, e) => e.nSteps > acc.nSteps ? e : acc);

  return numbers[winner_game.nSteps] * sumLeft(winner_game.board);
}