import {Types, type Ast} from '../ast.js';

import {makeTraverse} from './traverse.js';

// If one array is `any[]`, but another is, say, `number[]`
// and they get merged, it should not be `Array<any | number>` but `number[]`
export const removeAny = makeTraverse({
	union(ast) {
		const filtered = new Set<Ast>();

		for (const item of ast.value) {
			if (item.type !== Types.any) {
				filtered.add(item);
			}
		}

		if (filtered.size === ast.value.size) {
			return false;
		}

		return {
			type: Types.union,
			value: filtered,
		};
	},
});
