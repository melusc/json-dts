import {
	Types,
	type Ast,
	type ObjectAst,
	type ObjectValueAst,
	type UnionAst,
} from '../ast.js';
import {isPrimitive} from '../util.js';

const typescriptExpectValue = <Expected>(_actual: Expected) => {
	/* Nothing */
};

type TraversalCallback = {
	union?: (ast: UnionAst) => false | Ast;
	object?: (ast: ObjectAst) => false | Ast;
};

export const makeTraverse = (cb: TraversalCallback) => {
	const traversalFunction = (ast: Ast, onChange: () => void): Ast => {
		if (ast.type === Types.union) {
			const modified = cb.union?.(ast) ?? false;
			if (modified !== false) {
				onChange();
				return traversalFunction(modified, onChange);
			}
		} else if (ast.type === Types.object) {
			const modified = cb.object?.(ast) ?? false;
			if (modified !== false) {
				onChange();
				return traversalFunction(modified, onChange);
			}
		}

		if (isPrimitive(ast)) {
			return ast;
		}

		if (ast.type === Types.array) {
			return {
				type: Types.array,
				value: traversalFunction(ast.value, onChange),
			};
		}

		if (ast.type === Types.union) {
			const result = new Set<Ast>();
			for (const item of ast.value) {
				result.add(traversalFunction(item, onChange));
			}

			return {
				type: Types.union,
				value: result,
			};
		}

		typescriptExpectValue<Types.object>(ast.type);

		const result = new Map<string, ObjectValueAst>();
		for (const [key, value] of ast.value) {
			result.set(key, {
				...value,
				value: traversalFunction(value.value, onChange),
			});
		}

		return {
			type: Types.object,
			value: result,
		};
	};

	return (ast: Ast, onChange?: () => void) =>
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		traversalFunction(ast, onChange ?? (() => {}));
};
