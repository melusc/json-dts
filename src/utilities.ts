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

import {
	Types,
	type AnyAst,
	type ArrayAst,
	type Ast,
	type BooleanAst,
	type NullAst,
	type NumberAst,
	type ObjectAst,
	type PrimitiveAst,
	type StringAst,
	type UnionAst,
} from './ast.js';

export function isPrimitive(ast: Ast): ast is PrimitiveAst {
	switch (ast.type) {
		case Types.any:
		case Types.boolean:
		case Types.null:
		case Types.number:
		case Types.string: {
			return true;
		}

		default: {
			return false;
		}
	}
}

export function isAny(ast: Ast): ast is AnyAst {
	return ast.type === Types.any;
}

export function isArray(ast: Ast): ast is ArrayAst {
	return ast.type === Types.array;
}

export function isBoolean(ast: Ast): ast is BooleanAst {
	return ast.type === Types.boolean;
}

export function isNull(ast: Ast): ast is NullAst {
	return ast.type === Types.null;
}

export function isNumber(ast: Ast): ast is NumberAst {
	return ast.type === Types.number;
}

export function isObject(ast: Ast): ast is ObjectAst {
	return ast.type === Types.object;
}

export function isString(ast: Ast): ast is StringAst {
	return ast.type === Types.string;
}

export function isUnion(ast: Ast): ast is UnionAst {
	return ast.type === Types.union;
}
