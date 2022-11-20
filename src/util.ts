import {Types, type Ast, type PrimitiveAst} from './ast.js';

export const isPrimitive = (ast: Ast): ast is PrimitiveAst => {
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
};
