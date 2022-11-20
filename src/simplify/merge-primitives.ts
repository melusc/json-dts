import {Types, type Ast, type PrimitiveAst} from '../ast.js';
import {isPrimitive} from '../util.js';

import {makeTraverse} from './traverse.js';

export const mergePrimitives = makeTraverse({
	union(ast) {
		const found = new Set<PrimitiveAst['type']>();

		const result = new Set<Ast>();

		for (const item of ast.value) {
			if (isPrimitive(item)) {
				if (!found.has(item.type)) {
					result.add(item);
					found.add(item.type);
				}
			} else {
				result.add(item);
			}
		}

		return {
			type: Types.union,
			value: result,
		};
	},
});
