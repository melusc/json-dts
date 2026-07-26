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

import {type Ast} from '../ast.js';

import {mergeArray} from './merge-array.js';
import {mergeObject} from './merge-object.js';
import {mergePrimitives} from './merge-primitives.js';
import {removeAny} from './remove-any.js';
import {simplifyUnion} from './simplify-union.js';
import {sortUnion} from './sort.js';

export function simplify(ast: Ast): Ast {
	let didAnyChange = false;
	do {
		didAnyChange = false;

		for (const function_ of [
			mergePrimitives,
			mergeObject,
			simplifyUnion,
			mergeArray,
			removeAny,
		]) {
			ast = function_(ast, () => {
				didAnyChange ||= true;
			});
		}
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	} while (didAnyChange);

	ast = sortUnion(ast);

	return ast;
}
