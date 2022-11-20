import {type Ast} from '../ast.js';

import {mergeObject} from './merge-object.js';
import {mergePrimitives} from './merge-primitives.js';
import {mergeUnion} from './merge-union.js';

export const mergeDeep = (ast: Ast): Ast => {
	let anyChanged = false;
	do {
		anyChanged = false;
		for (const fn of [mergePrimitives, mergeObject, mergeUnion]) {
			// eslint-disable-next-line @typescript-eslint/no-loop-func
			ast = fn(ast, () => {
				anyChanged ||= true;
			});
		}
	} while (anyChanged);

	return ast;
};
