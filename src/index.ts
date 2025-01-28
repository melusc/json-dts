import {toAst, type Ast} from './ast.js';
import {toDts} from './dts/dts.js';
import {type Filter} from './filter.js';
import type {JsonValue} from './json-value.js';
import {simplify} from './simplify/index.js';

export * from './ast.js';

type Options = {
	name: string;
	filter: Filter;
};

export function jsonAst(input: JsonValue, options?: Partial<Options>): Ast {
	const ast = toAst(input, options?.filter);

	return simplify(ast);
}

export function jsonDts(input: JsonValue, options?: Partial<Options>): string {
	const ast = jsonAst(input, options);

	return toDts(ast, options?.name);
}
