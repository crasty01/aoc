type Card = {
	hand: string;
	bet: number;
};
type Input = Array<Card>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.replace('\r\n', '\n').split('\n').map(line => {
		const [hand, bet] = line.split(' ');
		return {
			hand,
			bet: parseInt(bet),
		}
	});
}

const getHandValueBasic = (hand: string): number => {
	const types = [0, 0, 0, 0, 0];
	const cards = new Map<string, number>();
	for (let i = 0; i < hand.length; i++) {
		cards.set(hand[i], (cards.get(hand[i]) ?? 0) + 1);
	}

	for (const appearance of cards.values()) {
		types[appearance - 1] += 1;
	}

	switch (types.join('')) {
		case '50000': return 0; // HIGH_CARD
		case '31000': return 1; // PAIR
		case '12000': return 2; // TWO_PAIRS
		case '20100': return 3; // THREE_OF_A_KIND
		case '01100': return 4; // FULL_HOUSE
		case '10010': return 5; // FOUR_OF_A_KIND
		case '00001': return 6; // FIVE_OF_A_KIND
		default:
			throw new Error(`BAD TYPES: '${types.join('')}'`);
	}
}

solutions[0] = (input: Input): number =>  {
	const cardValues = 'AKQJT98765432';
	let sum = 0;

	const sorted = input.map(e => ({
		...e,
		value: getHandValueBasic(e.hand),
	})).toSorted((a, b) => {
		if (a.value === b.value) {
			for (let i = 0; i < a.hand.length; i++) {
				if (a.hand[i] === b.hand[i]) continue;
				return cardValues.indexOf(b.hand[i]) - cardValues.indexOf(a.hand[i])
			}
			return 0;
		}
		return a.value - b.value;
	});

	for (let i = 0; i < sorted.length; i++) {
		sum += (i + 1) * sorted[i].bet;
	}

	return sum
}

const getHandValueAdvanced = (hand: string): number => {
	const types = [0, 0, 0, 0, 0];
	const cards = new Map<string, number>();
	for (let i = 0; i < hand.length; i++) {
		cards.set(hand[i], (cards.get(hand[i]) ?? 0) + 1);
	}

	for (const [card, appearance] of cards.entries()) {
		if (card === 'J') continue;
		types[appearance - 1] += 1;
	}

	switch (types.join('')) {
		// 0x Joker
		case '50000': return 0; // HIGH_CARD
		case '31000': return 1; // PAIR
		case '12000': return 2; // TWO_PAIRS
		case '20100': return 3; // THREE_OF_A_KIND
		case '01100': return 4; // FULL_HOUSE
		case '10010': return 5; // FOUR_OF_A_KIND
		case '00001': return 6; // FIVE_OF_A_KIND
		// 1x Joker
		case '40000': return 1;
		case '21000': return 3;
		case '02000': return 4;
		case '10100': return 5;
		case '00010': return 6;
		// 2x Joker
		case '30000': return 3;
		case '11000': return 5;
		case '00100': return 6;
		// 3x Joker
		case '20000': return 5;
		case '01000': return 6;
		// 4x Joker
		case '10000': return 6;
		// 5x Joker
		case '00000': return 6;
		default:
			throw new Error(`COMBINATION NOT FOUND: types: ${types.join('')}, hand: ${hand}`);
	}
}

solutions[1] = (input: Input): number =>  {
	const cardValues = 'AKQT98765432J';
	let sum = 0;

	const sorted = input.map(e => ({
		...e,
		value: getHandValueAdvanced(e.hand),
	})).toSorted((a, b) => {
		if (a.value === b.value) {
			for (let i = 0; i < a.hand.length; i++) {
				if (a.hand[i] === b.hand[i]) continue;
				return cardValues.indexOf(b.hand[i]) - cardValues.indexOf(a.hand[i])
			}
			return 0;
		}
		return a.value - b.value;
	});

	for (let i = 0; i < sorted.length; i++) {
		sum += (i + 1) * sorted[i].bet;
	}

	return sum
}