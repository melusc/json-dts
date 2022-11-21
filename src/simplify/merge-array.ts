import {type Ast, Types} from '../ast.js';
import {isArray} from '../util.js';
import {makeTraverse} from './traverse.js';

export const mergeArray = makeTraverse({
	union(ast) {
		let amountArraysFound = 0;

		const merged = new Set<Ast>();
		const union = new Set<Ast>();
		for (const item of ast.value) {
			if (isArray(item)) {
				merged.add(item.value);

				if (amountArraysFound === 0) {
					union.add({
						type: Types.array,
						value: {
							type: Types.union,
							value: merged,
						},
					});
				}

				++amountArraysFound;
			} else {
				union.add(item);
			}
		}

		if (amountArraysFound <= 1) {
			return false;
		}

		return {
			type: Types.union,
			value: union,
		};
	},
});
