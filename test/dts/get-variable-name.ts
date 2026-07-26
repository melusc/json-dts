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

import test from 'ava';

import {getVariableName} from '../../src/dts/get-variable-name.js';

test('getName', t => {
	const scope = new Set<string>();

	t.is(getVariableName(undefined, scope), 'T0');
	t.is(getVariableName(undefined, scope), 'T1');
	t.is(getVariableName(undefined, scope), 'T2');

	t.is(getVariableName('many-words-here', scope), 'ManyWordsHere');
	t.is(getVariableName('many-words-here', scope), 'ManyWordsHere1');
	t.is(getVariableName('many-words_here', scope), 'ManyWordsHere2');

	t.is(getVariableName('?QPf3<', scope), '_Qpf3');
	t.is(getVariableName('?QPf3<', scope), '_Qpf31');
	t.is(getVariableName('?QPf3<', scope), '_Qpf32');

	t.is(getVariableName('Vvp`Cii', scope), 'VvpCii');

	t.is(getVariableName('1aji', scope), '_1Aji');
});
