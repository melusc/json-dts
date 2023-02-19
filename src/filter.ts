export type FilterFunction = (path: string[]) => boolean;
export type Filter = string[] | FilterFunction;

export function createFilter(filter?: Filter): FilterFunction {
	if (typeof filter === 'function') {
		return filter;
	}

	if (typeof filter === 'undefined') {
		return () => true;
	}

	const filterSet = new Set(filter);

	return function (path: string[]) {
		if (path.length === 0) {
			return false;
		}

		return !filterSet.has(path.at(-1)!);
	};
}
