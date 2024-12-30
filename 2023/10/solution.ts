type Input = {
	width: number;
	height: number;
	content: string;
	start: number;
};

type Part = {
	symbol: string;
	pos: number;
}

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
	const width = rawInut.indexOf('\r\n') > -1 ? rawInut.indexOf('\r\n') : rawInut.indexOf('\n');
  const content =  rawInut.replace(/\r?\n/g, '');
	const start = content.indexOf('S');

	return {
		width,
		height: content.length / width,
		content,
		start,
	}
}

const getPositionBySymbol = (pos: number, width: number, symbol: string): Array<number> => {
	const top = pos - width;
	const right = pos + 1;
	const bottom = pos + width;
	const left = pos - 1;
	switch (symbol) {
		case '|': return [top, bottom]
		case '-': return [left, right]
		case 'L': return [top, right]
		case 'J': return [top, left]
		case '7': return [left, bottom]
		case 'F': return [right, bottom]
		case '.': return []
		case 'S': return []
		default: throw new Error(`UNKNOWN SYMBOL: '${symbol}'`);
	}
}

solutions[0] = (input: Input): number => {
	const path: Array<Part> = [{
		symbol: 'S',
		pos: input.start,
	}];

	loop: for (let i = -1; i <= 1; i++) {
		for (let j = -1; j <= 1; j++) {
			if (i === 0 && j === 0) continue;
			const pos = path[0].pos + i * input.width + j;
			const possibleStartPositions = getPositionBySymbol(pos, input.width, input.content[pos]);
			const possibleStartIndex = possibleStartPositions.indexOf(path[0].pos)
			if (possibleStartIndex !== -1) {
				path.push({
					pos,
					symbol: input.content[pos]
				});
				break loop;
			}
		}
	}

	while (path.at(-1)!.symbol !== 'S') {
		const prev = path.at(-2)!;
		const current = path.at(-1)!;
		const nextPositions = getPositionBySymbol(current.pos, input.width, current.symbol);
		const nextPosition = nextPositions.find(pos => pos !== prev.pos);
		if (!nextPosition) throw new Error("NO NEXT POSITION");
		
		path.push({
			pos: nextPosition,
			symbol: input.content[nextPosition]
		});
	}
	
  return Math.floor(path.length / 2);
}

solutions[1] = (input: Input): number => {
	const path: Array<Part> = [{
		symbol: 'S',
		pos: input.start,
	}];

	loop: for (let i = -1; i <= 1; i++) {
		for (let j = -1; j <= 1; j++) {
			if (i === 0 && j === 0) continue;
			const pos = path[0].pos + i * input.width + j;
			const possibleStartPositions = getPositionBySymbol(pos, input.width, input.content[pos]);
			const possibleStartIndex = possibleStartPositions.indexOf(path[0].pos)
			if (possibleStartIndex !== -1) {
				path.push({
					pos,
					symbol: input.content[pos]
				});
				break loop;
			}
		}
	}

	while (path.at(-1)!.symbol !== 'S') {
		const prev = path.at(-2)!;
		const current = path.at(-1)!;
		const nextPositions = getPositionBySymbol(current.pos, input.width, current.symbol);
		const nextPosition = nextPositions.find(pos => pos !== prev.pos);
		if (!nextPosition) throw new Error("NO NEXT POSITION");
	
		if (input.content[nextPosition] === 'S') break;
		path.push({
			pos: nextPosition,
			symbol: input.content[nextPosition]
		});
	}

	const firstAndLast = `${path[1].symbol}${path.at(-1)!.symbol}`;
	switch (firstAndLast) {
		case 'J|':
			path[0].symbol = 'F'
			break;
		case '||':
			path[0].symbol = '|'
			break;
		default: throw new Error(`CANNOT GUESS STARTING SYMBOL FOR: '${firstAndLast}'`);
	}
	// TODO: add all possible guesses

	const map = new Map<number, number>();
	for (let i = 0; i < path.length; i++) {
		map.set(path[i].pos, i);
	}

	let inside = 0;
	let isInside = false;
	let lastBend: undefined | Part = undefined;
	for (let pos = 0; pos < input.content.length; pos++) {
		if (pos % input.width === 0) isInside = false;

		if (!map.has(pos)) {	
			inside += +isInside;
			continue;
		}
		
		const part = path[map.get(pos)!];

		if (part.symbol === '-') continue;
		if (part.symbol === '|') {
			isInside = !isInside;
			continue;
		}
		if (!lastBend) {
			lastBend = part;
			continue;
		}

		if (
			(lastBend.symbol === 'F' && part.symbol === 'J') ||
			(lastBend.symbol === 'L' && part.symbol === '7')
		) {
			isInside = !isInside
		}

		lastBend = undefined;
	}
	
  return inside;
}