import Grid from '/src/lib/grid.ts';

type Input = {
  dots: Array<Position>;
  folding: Array<Fold>
};
type Fold = {
  axis: 'x' | 'y';
  position: number;
}
type Position = {
  x: number;
  y: number;
}

export const parseInput = (rawInut: string): Input => {
  const [dots, folding] = rawInut.split('\r\n\r\n')
  return {
    dots: dots.split('\r\n').map(e => {
      const [x, y] = e.split(',');
      return {
        x: +x,
        y: +y,
      } as Position
    }),
    folding: folding.split('\r\n').map(e => {
      const { axis, position } = /^fold along (?<axis>\w)=(?<position>\d+)$/.exec(e)!.groups as { axis: string; position: string }
      return {
        axis: axis,
        position: +position,
      } as Fold
    })
  }
}

export const solution1 = (input: Input): number | string =>  {
  let dots: Set<string> = new Set()
  for (let i = 0; i < input.dots.length; i++) {
    dots.add(`${input.dots[i].x}-${input.dots[i].y}`)
  }
  //for (let i = 0; i < input.folding.length; i++) {
  for (let i = 0; i < 1; i++) {
    const { axis, position: pos } = input.folding[i];
    const dots_array: Array<Array<number>> = [...dots].map(e => e.split('-').map(Number));
    const _dots: Set<string> = new Set();
    const p = axis === 'x' ? 0 : 1;
    for (let j = 0; j < dots_array.length; j++) {
      const a = dots_array[j]
      if (a[p] > pos) {
        a[p] = 2 * pos - a[p]
      }
      _dots.add(`${a[0]}-${a[1]}`)
    }
    dots = _dots;
  }
  return dots.size;
}

export const solution2 = (input: Input): number | string =>  {
  let dots: Set<string> = new Set()
  for (let i = 0; i < input.dots.length; i++) {
    dots.add(`${input.dots[i].x}-${input.dots[i].y}`)
  }
  for (let i = 0; i < input.folding.length; i++) {
    const { axis, position: pos } = input.folding[i];
    const dots_array: Array<Array<number>> = [...dots].map(e => e.split('-').map(Number));
    const _dots: Set<string> = new Set();
    const p = axis === 'x' ? 0 : 1;
    for (let j = 0; j < dots_array.length; j++) {
      const a = dots_array[j]
      if (a[p] >= pos) {
        a[p] = pos - (a[p] - pos)
      }
      _dots.add(`${a[0]}-${a[1]}`)
    }
    dots = _dots;
  }


  // Display ------------

  const dots_after_folding = [...dots].map(e => e.split('-').map(Number))
  const max = {
    x: -Infinity,
    y: -Infinity
  };
  for (const dot of dots_after_folding) {
    const [x, y] = dot;
    max.x = x > max.x ? x : max.x
    max.y = y > max.y ? y : max.y
  }
  const grid = new Grid(max.y + 1, max.x + 1, () => 1)
  for (const dot of dots_after_folding) {
    const [x, y] = dot;
    const c = grid.cell(x, y)
    if (c) c.value = 0;
  }


  return `\n\n${grid.toString('').replace(/1|0/g, e => e === '0' ? '\u2588' : ' ')}\n`;
}