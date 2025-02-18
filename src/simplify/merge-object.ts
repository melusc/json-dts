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
		target.set(key, {
			type: Types.objectValue,
			optional: !target.has(key) || target.get(key)!.optional || value.optional,
			value: {
				type: Types.union,
				value: new Set(filterUndefined(target.get(key)?.value, value.value)),
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
