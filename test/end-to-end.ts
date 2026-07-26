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

import {jsonDts} from '../src/index.js';

test('jsonDts', t => {
	t.is(jsonDts([1, 2, 3]), 'type T0 = number[];\n');
	t.is(jsonDts([true, 0]), 'type T0 = Array<boolean | number>;\n');
	t.is(jsonDts([0, true]), 'type T0 = Array<boolean | number>;\n');
	t.snapshot(jsonDts([{x: {y: 1}}]));
	t.snapshot(jsonDts([{x: {y: 1}}], {name: 'X'}));
	t.snapshot(jsonDts([{x: {y: 1}}], {name: 'Y'}));
	t.snapshot(jsonDts([{x: {y: 1}}], {name: 'T'}));
	t.snapshot(jsonDts([{x: 1}], {name: 't'}));
	t.snapshot(jsonDts({x: 1}, {name: 't'}));
	t.snapshot(jsonDts({t: {t: 1}}, {name: 't'}));

	t.throws(() => {
		jsonDts({}, {name: '1a'});
	});
	t.throws(() => {
		jsonDts({}, {name: '_ü'});
	});
});
