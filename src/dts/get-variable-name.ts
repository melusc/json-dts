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
