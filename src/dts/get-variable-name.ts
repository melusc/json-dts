import camelcase from 'camelcase';

export function getVariableName(
	suggestion: string | undefined,
	usedNames: Set<string>,
	n?: number,
): string {
	n ??= 0;

	// Replace characters that can't be in a variable with `_`
	suggestion = suggestion?.replaceAll(/\W/g, '_').trim();

	let name: string | undefined;

	do {
		if (suggestion === undefined) {
			// If no suggestion it becomes "T"
			// but for "T" it should always have a number at the end
			const newName = `T${n}`;

			name = newName;
			++n;
			continue;
		}

		let newName = camelcase(`${suggestion}${n === 0 ? '' : n}`, {
			pascalCase: true,
		});

		// It cannot start with a number
		if (/^\d/.test(newName)) {
			newName = '_' + newName;
		}

		if (newName === '') {
			n = 0;
			suggestion = undefined;
		} else {
			++n;
			name = newName;
		}
	} while (!name || usedNames.has(name));

	usedNames.add(name);
	return name;
}
