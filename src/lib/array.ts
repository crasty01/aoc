export const rotateArray = <T extends any = any>(array: Array<Array<T>>, n = 1) => {
  let matrix = array;
  for (let i = 0; i < n; i++) {
    matrix = matrix[0].map((_, index) => matrix.map(row => row[index]).reverse())
  }
  return matrix;
}