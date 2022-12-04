type Input = Array<string>; 

export const parseInput = (rawInut: string): Input => {
  return rawInut.split('\n');;
}

export const solution1 = (input: Input): number | string =>  {
  const gamma_arr = [...Array(12).fill(0)];
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < gamma_arr.length; j++) {
      if (input[i].charAt(j) === '1') gamma_arr[j]++
    }
  }
  const gamma = parseInt(gamma_arr.map(e => +(e > Math.floor(input.length / 2))).join(''), 2);
  const epsilon = parseInt(gamma_arr.map(e => +(e < Math.floor(input.length / 2))).join(''), 2);
  return gamma * epsilon;
}

export const solution2 = (input: Input): number | string =>  {
  const l = input[0].length;
  let a = [...input];
  let b = [...input];

  for (let i = 0; i < l && a.length > 1; i++) {
    let ca = 0;

    for (let j = 0; j < a.length; j++) {
      if (a[j][i] === '1') ca += 1;
    }
    const da = ca >= a.length - ca;
    a = a.filter(e => da ? e[i] === '1' : e[i] === '0')
  }

  for (let i = 0; i < l && b.length > 1; i++) {
    let cb = 0;
    for (let j = 0; j < b.length; j++) {
      if (b[j][i] === '1') cb += 1;
    }
    const db = cb < b.length - cb;
    b = b.filter(e => db ? e[i] === '1' : e[i] === '0')
  }
  
  return parseInt(a[0], 2) * parseInt(b[0], 2)
}