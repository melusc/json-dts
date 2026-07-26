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

import {Types, type Ast, type PrimitiveAst} from '../ast.js';
import {isPrimitive} from '../utilities.js';

import {makeTraverse} from './traverse.js';

export const mergePrimitives = makeTraverse({
	union(ast) {
		const found = new Set<PrimitiveAst['type']>();

		const result = new Set<Ast>();
		let didFilter = false;

		for (const item of ast.value) {
			if (isPrimitive(item)) {
				if (found.has(item.type)) {
					didFilter = true;
				} else {
					result.add(item);
					found.add(item.type);
				}
			} else {
				result.add(item);
			}
		}

		if (!didFilter) {
			return false;
		}

		return {
			type: Types.union,
			value: result,
		};
	},
});
