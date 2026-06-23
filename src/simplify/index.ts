import {type Ast} from '../ast.js';

import {mergeArray} from './merge-array.js';
import {mergeObject} from './merge-object.js';
import {mergePrimitives} from './merge-primitives.js';
import {removeAny} from './remove-any.js';
import {simplifyUnion} from './simplify-union.js';
import {sortUnion} from './sort.js';

export function simplify(ast: Ast): Ast {
	let didAnyChange = false;
	do {
		didAnyChange = false;

		for (const function_ of [
			mergePrimitives,
			mergeObject,
			simplifyUnion,
			mergeArray,
			removeAny,
		]) {
			ast = function_(ast, () => {
				didAnyChange ||= true;
			});
		}
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	} while (didAnyChange);

	ast = sortUnion(ast);

	return ast;
}
