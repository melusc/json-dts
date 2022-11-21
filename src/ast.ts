import type {JsonValue, ReadonlyDeep} from 'type-fest';

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

export const toAst = (input: JsonValue): Ast => {
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

	if (Array.isArray(input)) {
		return {
			type: Types.array,
			value: {
				type: Types.union,
				value: new Set(input.map(v => toAst(v))),
			},
		};
	}

	const result = new Map<string, ObjectValueAst>();

	for (const key of Object.keys(input)) {
		result.set(key, {
			type: Types.objectValue,
			optional: false,
			value: toAst(input[key]!),
		});
	}

	return {
		type: Types.object,
		value: result,
	};
};
