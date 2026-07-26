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

import {type Ast, Types} from '../ast.js';
import {isArray} from '../utilities.js';

import {makeTraverse} from './traverse.js';

export const mergeArray = makeTraverse({
	union(ast) {
		let amountArraysFound = 0;

		const merged = new Set<Ast>();
		const union = new Set<Ast>();
		for (const item of ast.value) {
			if (isArray(item)) {
				merged.add(item.value);

				if (amountArraysFound === 0) {
					union.add({
						type: Types.array,
						value: {
							type: Types.union,
							value: merged,
						},
					});
				}

				++amountArraysFound;
			} else {
				union.add(item);
			}
		}

		if (amountArraysFound <= 1) {
			return false;
		}

		return {
			type: Types.union,
			value: union,
		};
	},
});
