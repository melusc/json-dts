import type {JsonValue} from 'type-fest';

import {toAst, type Ast} from './ast.js';
import {simplifyDeep} from './simplify/index.js';

export * from './ast.js';

export const jsonTypeAst = (input: JsonValue): Ast => {
	let ast = toAst(input);
	ast = simplifyDeep(ast);

	return ast;
};

export const jsonType = (input: JsonValue): string => {
	const ast = jsonTypeAst(input);

	// TODO
	return String(ast);
};
