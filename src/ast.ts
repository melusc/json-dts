import type {JsonValue, ReadonlyDeep} from 'type-fest';

export const enum Types {
	string,
	number,
	boolean,
	null,
	array,
	object,
	any,
	union,
	objectValue,
}

export type PrimitiveAst = ReadonlyDeep<{
	type: Types.boolean | Types.number | Types.null | Types.string | Types.any;
}>;

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
