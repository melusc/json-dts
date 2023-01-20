import type {JsonValue} from 'type-fest';

import {toAst, type Ast} from './ast.js';
import {simplify} from './simplify/index.js';
import {toDts} from './dts/dts.js';

export * from './ast.js';

export const jsonAst = (input: JsonValue): Ast => {
	const ast = toAst(input);

	return simplify(ast);
};

export const jsonDts = (input: JsonValue, name?: string): string => {
	const ast = jsonAst(input);

	return toDts(ast, name);
};
