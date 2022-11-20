import {JsonValue} from 'type-fest';

export const enum Types {
	string,
	number,
	boolean,
	null,
	array,
	object,
}

export type Ast =
	| {
		type: Types.boolean | Types.number | Types.null | Types.string;
	  }
	| {
		type: Types.array;
		value: Ast[];
	  }
	| {
		type: Types.object;
		value: Record<string, Ast>;
	  };

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
			value: input.map(v => toAst(v)),
		};
	}

	const result: Record<string, Ast> = Object.create(null);

	for (const key of Object.keys(input)) {
		result[key] = toAst(input[key]!);
	}

	return {
		type: Types.object,
		value: result,
	};
};
