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
	type Ast,
	type ObjectAst,
	type ObjectValueAst,
	type UnionAst,
} from '../ast.js';
import {isArray, isObject, isPrimitive, isUnion} from '../utilities.js';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
function typescriptExpectValue<Expected>(_actual: Expected) {
	/* Nothing */
}

type TraversalCallback = {
	union?: (ast: UnionAst) => false | Ast;
	object?: (ast: ObjectAst) => false | Ast;
};

export function makeTraverse(traversers: TraversalCallback) {
	function traversalFunction(ast: Ast, onChange: () => void): Ast {
		let didModify: boolean;

		do {
			didModify = false;

			if (isUnion(ast)) {
				const newAst = traversers.union?.(ast) ?? false;
				if (newAst !== false) {
					onChange();
					didModify = true;
					ast = newAst;
				}
			}

			if (isObject(ast)) {
				const newAst = traversers.object?.(ast) ?? false;
				if (newAst !== false) {
					onChange();
					didModify = true;
					ast = newAst;
				}
			}
		} while (didModify);

		if (isPrimitive(ast)) {
			return ast;
		}

		if (isArray(ast)) {
			return {
				type: Types.array,
				value: traversalFunction(ast.value, onChange),
			};
		}

		if (isUnion(ast)) {
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
	}

	return (ast: Ast, onChange?: () => void) =>
		traversalFunction(ast, onChange ?? (() => {}));
}
