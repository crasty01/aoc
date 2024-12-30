type Input = Array<Command>;
type Command = {
  key: string;
  value: number;
};

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split('\n').map(e => {
    const [key, value] = e.split(' ');
    return {
      key: key,
      value: Number(value),
    } as Command;
  });
}

solutions[0] = (input: Input): number | string => {
  const pos = {
    x: 0,
    y: 0,
  }
  for (const command of input) {
    switch (command.key) {
      case 'up':
        pos.y -= command.value;
        break;
      case 'down':
        pos.y += command.value;
        break;
      case 'forward':
        pos.x += command.value;
        break;
      default:
        break;
    }
  }
  return pos.x * pos.y;
}

solutions[1] = (input: Input): number | string => {
  const pos = {
    x: 0,
    y: 0,
    aim: 0,
  }
  for (const command of input) {
    switch (command.key) {
      case 'up':
        pos.aim -= command.value;
        break;
      case 'down':
        pos.aim += command.value;
        break;
      case 'forward':
        pos.x += command.value;
        pos.y += command.value * pos.aim;
        break;
      default:
        break;
    }
  }
  return pos.x * pos.y;
}