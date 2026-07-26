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

import {toAst, Types} from '../../src/ast.js';
import {mergePrimitives} from '../../src/simplify/merge-primitives.js';

test('Array of numbers', t => {
	const ast = toAst([1, 2, 3, 4, 5, 6]);

	t.deepEqual(mergePrimitives(ast), {
		type: Types.array,
		value: {
			type: Types.union,
			value: new Set([{type: Types.number}]),
		},
	});
});

test('Array of booleans and numbers', t => {
	const ast = toAst([1, 2, 3, true, 1, false]);

	t.deepEqual(mergePrimitives(ast), {
		type: Types.array,
		value: {
			type: Types.union,
			value: new Set([{type: Types.number}, {type: Types.boolean}]),
		},
	});
});
