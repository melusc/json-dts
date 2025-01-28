import {createFilter, type Filter, type FilterFunction} from './filter.js';
import type {JsonValue} from './json-value.js';

export const enum Types {
	any = 'any',
	array = 'array',
	boolean = 'boolean',
	null = 'null',
	number = 'number',
	object = 'object',
	objectValue = 'objectValue',
	string = 'string',
	union = 'union',
}

export type AnyAst = {
	readonly type: Types.any;
};

export type BooleanAst = {
	readonly type: Types.boolean;
};

export type NullAst = {
	readonly type: Types.null;
};

export type NumberAst = {
	readonly type: Types.number;
};

export type StringAst = {
	readonly type: Types.string;
};

export type PrimitiveAst =
	| AnyAst
	| BooleanAst
	| NullAst
	| NumberAst
	| StringAst;

export type ArrayAst = {
	readonly type: Types.array;
	readonly value: Ast;
};

export type UnionAst = {
	readonly type: Types.union;
	readonly value: ReadonlySet<Ast>;
};

export type ObjectValueAst = {
	readonly type: Types.objectValue;
	readonly optional: boolean;
	readonly value: Ast;
};

export type ObjectAst = {
	readonly type: Types.object;
	readonly value: ReadonlyMap<string, ObjectValueAst>;
};

export type Ast = PrimitiveAst | ArrayAst | ObjectAst | UnionAst;

const isReadonlyArray = Array.isArray as (
	argument0: unknown,
) => argument0 is readonly unknown[];

function toAstInternal(
	input: JsonValue,
	path: string[],
	filter: FilterFunction,
): Ast {
	if (typeof input === 'string') {
		return {
			type: Types.string,
		};
	}

	if (input === null) {
		return {
			type: Types.null,
		};
	}

	if (typeof input === 'boolean') {
		return {
			type: Types.boolean,
		};
	}

	if (typeof input === 'number') {
		return {
			type: Types.number,
		};
	}

	if (isReadonlyArray(input)) {
		if (input.length === 0) {
			return {
				type: Types.array,
				value: {
					type: Types.any,
				},
			};
		}

		return {
			type: Types.array,
			value: {
				type: Types.union,
				value: new Set(
					input.map((value, index) => {
						const subPath = [...path, String(index)];
						if (!filter(subPath)) {
							return {
								type: Types.any,
							};
						}

						return toAstInternal(value, subPath, filter);
					}),
				),
			},
		};
	}

	const result = new Map<string, ObjectValueAst>();

	for (const key of Object.keys(input)) {
		const subPath = [...path, key];
		if (!filter(subPath)) {
			result.set(key, {
				type: Types.objectValue,
				optional: false,
				value: {
					type: Types.any,
				},
			});

			continue;
		}

		result.set(key, {
			type: Types.objectValue,
			optional: false,
			value: toAstInternal(input[key]!, subPath, filter),
		});
	}

	return {
		type: Types.object,
		value: result,
	};
}

export function toAst(input: JsonValue, filter?: Filter) {
	return toAstInternal(input, [], createFilter(filter));
}
