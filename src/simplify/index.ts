import {type Ast} from '../ast.js';

import {mergeArray} from './merge-array.js';
import {mergeObject} from './merge-object.js';
import {mergePrimitives} from './merge-primitives.js';
import {removeAny} from './remove-any.js';
import {simplifyUnion} from './simplify-union.js';
import {sortUnion} from './sort.js';

export function simplify(ast: Ast): Ast {
	let anyChanged = false;
	do {
		anyChanged = false;

		for (const fn of [
			mergePrimitives,
			mergeObject,
			simplifyUnion,
			mergeArray,
			removeAny,
		]) {
			// eslint-disable-next-line @typescript-eslint/no-loop-func
			ast = fn(ast, () => {
				anyChanged ||= true;
			});
		}
	} while (anyChanged);

	ast = sortUnion(ast);

	return ast;
}
