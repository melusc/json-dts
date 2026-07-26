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

import {makeTraverse} from './traverse.js';

/*
If at some point there might be multiple
arrays or objects in a union (after simplifying)
the logic below needs to change.

An option would be to calculate some hash and then compare those for stable sorting.
The hash would need to be the same for the same object after sorting the keys.
*/

// Primitives first
// Rest is arbitrary
const typesOrder = {
	[Types.any]: 0,
	[Types.array]: 1,
	[Types.boolean]: 2,
	[Types.null]: 3,
	[Types.number]: 4,
	[Types.object]: 5,
	[Types.string]: 6,
	[Types.union]: 7,
} as const;

function compare(a: Ast, b: Ast): number {
	return typesOrder[a.type] - typesOrder[b.type];
}

function isSorted(array: Ast[]): boolean {
	for (let index = 0; index < array.length - 1; ++index) {
		if (compare(array[index]!, array[index + 1]!) > 0) {
			return false;
		}
	}

	return true;
}

export const sortUnion = makeTraverse({
	union(ast) {
		const items = [...ast.value];

		if (isSorted(items)) {
			return false;
		}

		items.sort(compare);

		return {
			type: Types.union,
			value: new Set(items),
		};
	},
});
