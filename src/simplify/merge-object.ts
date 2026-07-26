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

import {Types, type Ast, type ObjectAst, type ObjectValueAst} from '../ast.js';
import {isObject} from '../utilities.js';

import {makeTraverse} from './traverse.js';

function* filterUndefined<T>(...array: Array<T | undefined>): Iterable<T> {
	for (const item of array) {
		if (item !== undefined) {
			yield item;
		}
	}
}

function mergeInto(
	target: Map<string, ObjectValueAst>,
	object: ObjectAst,
	isFirst: boolean,
): void {
	if (isFirst) {
		for (const [key, value] of object.value) {
			target.set(key, value);
		}

		return;
	}

	for (const [key, value] of target) {
		if (!object.value.has(key)) {
			target.set(key, {
				...value,
				optional: true,
			});
		}
	}

	for (const [key, value] of object.value) {
		const targetValue = target.get(key);

		target.set(key, {
			type: Types.objectValue,
			optional: !target.has(key) || targetValue!.optional || value.optional,
			value: {
				type: Types.union,
				value: new Set(filterUndefined(targetValue?.value, value.value)),
			},
		});
	}
}

/**
Merge objects in unions

The objects are converted
```
Map<
	string,
	ObjectValueAst<UnionAst>
>
```

If all objects have `key` it is not optional
	unless one of the objects has `key` as optional
 */
export const mergeObject = makeTraverse({
	union(ast) {
		const result = new Set<Ast>();

		let amountObjectsFound = 0;
		const mergedObject = new Map<string, ObjectValueAst>();

		for (const item of ast.value) {
			if (isObject(item)) {
				mergeInto(mergedObject, item, amountObjectsFound === 0);
				if (amountObjectsFound === 0) {
					result.add({
						type: Types.object,
						value: mergedObject,
					});
				}

				++amountObjectsFound;
			} else {
				result.add(item);
			}
		}

		if (amountObjectsFound <= 1) {
			return false;
		}

		return {
			type: Types.union,
			value: result,
		};
	},
});
