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

import {Types, type Ast} from '../ast.js';
import {isUnion} from '../utilities.js';

import {makeTraverse} from './traverse.js';

export const simplifyUnion = makeTraverse({
	union(ast) {
		if (!isUnion(ast)) {
			return false;
		}

		if (ast.value.size === 1) {
			return [...ast.value][0]!;
		}

		const result = new Set<Ast>();

		let didMerge = false;

		for (const item of ast.value) {
			if (isUnion(item)) {
				didMerge = true;
				for (const unionItem of item.value) {
					result.add(unionItem);
				}
			} else {
				result.add(item);
			}
		}

		if (!didMerge) {
			return false;
		}

		return {
			type: Types.union,
			value: result,
		};
	},
});
