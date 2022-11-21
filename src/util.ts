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
