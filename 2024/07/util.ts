export const combinationsWithReplacement = <T>(elements: Array<T>, n: number): Array<Array<T>> => {
  if (n === 0) return [[]]; // Base case: one combination of length 0 (empty array)
  
  const result: Array<Array<T>> = [];
  
  for (const element of elements) {
    const smallerCombinations = combinationsWithReplacement(elements, n - 1);
    for (const combination of smallerCombinations) {
      result.push([element, ...combination]);
    }
  }
  
  return result;
}