import {type Ast} from '../ast.js';

import {mergeObject} from './merge-object.js';
import {mergePrimitives} from './merge-primitives.js';
import {simplifyUnion} from './simplify-union.js';

export const simplifyDeep = (ast: Ast): Ast => {
	let anyChanged = false;
	do {
		anyChanged = false;
		for (const fn of [mergePrimitives, mergeObject, simplifyUnion]) {
			// eslint-disable-next-line @typescript-eslint/no-loop-func
			ast = fn(ast, () => {
				anyChanged ||= true;
			});
		}
	} while (anyChanged);

	return ast;
};
