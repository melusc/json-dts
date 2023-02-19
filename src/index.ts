import type {JsonValue} from 'type-fest';

import {toAst, type Ast} from './ast.js';
import {toDts} from './dts/dts.js';
import {type Filter} from './filter.js';
import {simplify} from './simplify/index.js';

export * from './ast.js';

type Options = {
	name: string;
	filter: Filter;
};

export const jsonAst = (input: JsonValue, options?: Partial<Options>): Ast => {
	const ast = toAst(input, options?.filter);

	return simplify(ast);
};

export const jsonDts = (
	input: JsonValue,
	options?: Partial<Options>,
): string => {
	const ast = jsonAst(input, options);

	return toDts(ast, options?.name);
};
