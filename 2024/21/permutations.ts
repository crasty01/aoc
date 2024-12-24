export const permuation = (symbols: string, current = ''): Array<string> => {
	if (symbols.length === 0) return [current];

	const res = new Set<string>();

	for (let i = 0; i < symbols.length; i++) {
		const char = symbols[i];
		const _symbols = symbols.slice(0, i) + symbols.slice(i + 1);
		permuation(_symbols, current + char).forEach(e => res.add(e));
	}

	return [...res];
}