import {Types, type Ast} from '../ast.js';
import {isUnion} from '../util.js';

import {makeTraverse} from './traverse.js';

export const simplifyUnion = makeTraverse({
	union(ast) {
		if (!isUnion(ast)) {
			return false;
		}

		if (ast.value.size === 1) {
			return [...ast.value][0]!;
		}

		const result = new Set<Ast>();

		let anyMerged = false;

		for (const item of ast.value) {
			if (isUnion(item)) {
				anyMerged = true;
				for (const unionItem of item.value) {
					result.add(unionItem);
				}
			} else {
				result.add(item);
			}
		}

		if (!anyMerged) {
			return false;
		}

		return {
			type: Types.union,
			value: result,
		};
	},
});
