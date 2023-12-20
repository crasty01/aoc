export const gcd = (a: number, b: number): number => (b == 0) ? a : gcd(b, a % b)

const _lcm = (a: number, b: number) => (a * b) / gcd(a, b)
export const lcm = (list: Array<number>) => list.reduce((acc, n) => _lcm(acc, n));