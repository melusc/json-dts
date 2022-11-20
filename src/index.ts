import type {JsonValue} from 'type-fest';

import {toAst, type Ast} from './ast.js';
import {mergeDeep} from './merge/index.js';

export * from './ast.js';

export const jsonTypeAst = (input: JsonValue): Ast => {
	const ast = toAst(input);
	mergeDeep(ast);

	return ast;
};

export const jsonType = (input: JsonValue): string => {
	const ast = jsonTypeAst(input);

	// TODO
	return String(ast);
};
