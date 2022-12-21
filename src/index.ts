import type {JsonValue} from 'type-fest';

import {toAst, type Ast} from './ast.js';
import {simplify} from './simplify/index.js';
import {toDts} from './dts.js';

export * from './ast.js';

export const jsonTypeAst = (input: JsonValue): Ast => {
	const ast = toAst(input);

	return simplify(ast);
};

export const jsonType = (input: JsonValue): string => {
	const ast = jsonTypeAst(input);

	return toDts(ast);
};
