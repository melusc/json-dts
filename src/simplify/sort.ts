import {type Ast, Types} from '../ast.js';

import {makeTraverse} from './traverse.js';

/*
If at some point there might be multiple
arrays or objects in a union (after simplifying)
the logic below needs to change.

An option would be to calculate some hash and then compare those for stable sorting.
The hash would need to be the same for the same object after sorting the keys.
*/

// Primitives first
// Rest is arbitrary
const typesOrder = {
	[Types.any]: 0,
	[Types.array]: 1,
	[Types.boolean]: 2,
	[Types.null]: 3,
	[Types.number]: 4,
	[Types.object]: 5,
	[Types.string]: 6,
	[Types.union]: 7,
} as const;

function compare(a: Ast, b: Ast): number {
	return typesOrder[a.type] - typesOrder[b.type];
}

function isSorted(array: Ast[]): boolean {
	for (let i = 0; i < array.length - 1; ++i) {
		if (compare(array[i]!, array[i + 1]!) > 0) {
			return false;
		}
	}

	return true;
}

export const sortUnion = makeTraverse({
	union(ast) {
		const items = [...ast.value];

		if (isSorted(items)) {
			return false;
		}

		items.sort(compare);

		return {
			type: Types.union,
			value: new Set(items),
		};
	},
});
