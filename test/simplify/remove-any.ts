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

import {Types} from '../../src/ast.js';
import {removeAny} from '../../src/simplify/remove-any.js';

test('removeAny', t => {
	t.plan(2);

	t.deepEqual(
		removeAny(
			{
				type: Types.union,
				value: new Set([
					{
						type: Types.boolean,
					},
					{
						type: Types.any,
					},
				]),
			},
			t.pass,
		),
		{
			type: Types.union,
			value: new Set([
				{
					type: Types.boolean,
				},
			]),
		},
	);

	removeAny(
		{
			type: Types.union,
			value: new Set([
				{
					type: Types.string,
				},
			]),
		},
		t.fail,
	);
});
