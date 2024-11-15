import camelcase from 'camelcase';

export function getVariableName(
	suggestion: string | undefined,
	usedNames: Set<string>,
	n?: number,
): string {
	n ??= 0;

	// Replace characters that can't be in a variable with `_`
	suggestion = suggestion?.replace(/\W/g, '_').trim();

	if (suggestion === undefined) {
		// If no suggestion it becomes "T"
		// but for "T" it should always have a number at the end
		const name = `T${n}`;

		if (usedNames.has(name)) {
			return getVariableName(undefined, usedNames, n + 1);
		}

		usedNames.add(name);
		return name;
	}

	let name = camelcase(`${suggestion}${n === 0 ? '' : n}`, {
		pascalCase: true,
	});

	// It cannot start with a number
	if (/^\d/.test(name)) {
		name = '_' + name;
	}

	if (usedNames.has(name)) {
		return getVariableName(suggestion, usedNames, n + 1);
	}

	if (name === '') {
		return getVariableName(undefined, usedNames);
	}

	usedNames.add(name);
	return name;
}
