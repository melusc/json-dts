import type {JsonValue, ReadonlyDeep} from 'type-fest';
import {createFilter, type Filter, type FilterFunction} from './filter.js';

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

export type AnyAst = ReadonlyDeep<{
	type: Types.any;
}>;

export type BooleanAst = ReadonlyDeep<{
	type: Types.boolean;
}>;

export type NullAst = ReadonlyDeep<{
	type: Types.null;
}>;

export type NumberAst = ReadonlyDeep<{
	type: Types.number;
}>;

export type StringAst = ReadonlyDeep<{
	type: Types.string;
}>;

export type PrimitiveAst =
	| AnyAst
	| BooleanAst
	| NullAst
	| NumberAst
	| StringAst;

export type ArrayAst = ReadonlyDeep<{
	type: Types.array;
	value: Ast;
}>;

export type UnionAst = ReadonlyDeep<{
	type: Types.union;
	value: Set<Ast>;
}>;

export type ObjectValueAst = ReadonlyDeep<{
	type: Types.objectValue;
	optional: boolean;
	value: Ast;
}>;

export type ObjectAst = ReadonlyDeep<{
	type: Types.object;
	value: Map<string, ObjectValueAst>;
}>;

export type Ast = PrimitiveAst | ArrayAst | ObjectAst | UnionAst;

const isReadonlyArray = Array.isArray as (arg0: any) => arg0 is readonly any[];

const toAstInternal = (
	input: JsonValue,
	path: string[],
	filter: FilterFunction,
): Ast => {
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
					input
						.map((v, index) => ({
							path: [...path, String(index)],
							value: v,
						}))
						.filter(({path}) => filter(path))
						.map(({path, value}) => toAstInternal(value, path, filter)),
				),
			},
		};
	}

	const result = new Map<string, ObjectValueAst>();

	for (const key of Object.keys(input)) {
		const subPath = [...path, key];
		if (!filter(subPath)) {
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
};

export function toAst(input: JsonValue, filter?: Filter) {
	return toAstInternal(input, [], createFilter(filter));
}
