import {Types, type Ast} from '../ast.js';
import {makeTraverse} from './traverse.js';

export const simplifyUnion = makeTraverse({
	union(ast) {
		if (ast.type !== Types.union) {
			return false;
		}

		const result = new Set<Ast>();

		for (const item of ast.value) {
			if (item.type === Types.union) {
				for (const unionItem of item.value) {
					result.add(unionItem);
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
