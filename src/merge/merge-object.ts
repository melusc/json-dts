import {Types, type Ast, type ObjectAst, type ObjectValueAst} from '../ast.js';
import {makeTraverse} from './traverse.js';

function * filterUndefined<T>(...array: Array<T | undefined>): Iterable<T> {
	for (const item of array) {
		if (item !== undefined) {
			yield item;
		}
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
		const objects = new Set<ObjectAst>();
		const rest = new Set<Ast>();

		for (const item of ast.value) {
			if (item.type === Types.object) {
				objects.add(item);
			} else {
				rest.add(item);
			}
		}

		if (objects.size <= 1) {
			return false;
		}

		const merged = {
			type: Types.object,
			value: new Map<string, ObjectValueAst>(),
		};
		let isFirst = true;
		for (const item of objects) {
			for (const [key, value] of item.value) {
				if (isFirst) {
					merged.value.set(key, value);
				} else {
					merged.value.set(key, {
						type: Types.objectValue,
						optional:
							value.optional && (merged.value.get(key)?.optional ?? false),
						value: {
							type: Types.union,
							value: new Set(
								filterUndefined(merged.value.get(key)?.value, value.value),
							),
						},
					});
				}
			}

			isFirst = false;
		}

		return {
			type: Types.union,
			value: new Set<Ast>([
				...rest,
				// Todo: Use `satisfies ObjectAst` above when Prettier 2.8 releases
				merged as ObjectAst,
			]),
		};
	},
});
