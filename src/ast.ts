/*!
 * This file is part of @lusc/json-dts, a JSON to TypeScript definitions converter.
 * Copyright (C) 2026, Luca Schnellmann <oss@lusc.ch>

 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
	AnyAst | BooleanAst | NullAst | NumberAst | StringAst;

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

	for (const [key, value] of Object.entries(input)) {
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
			value: toAstInternal(value, subPath, filter),
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
