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

import {Types, type UnionAst} from '../../src/ast.js';
import {sortUnion} from '../../src/simplify/sort.js';

test('Two unions should sort the same', t => {
	const union1: UnionAst = {
		type: Types.union,
		value: new Set([
			{
				type: Types.string,
			},
			{
				type: Types.boolean,
			},
			{
				type: Types.null,
			},
			{
				type: Types.object,
				value: new Map(),
			},
			{
				type: Types.array,
				value: {
					type: Types.string,
				},
			},
		]),
	};
	const union2: UnionAst = {
		type: Types.union,
		value: new Set([
			{
				type: Types.null,
			},
			{
				type: Types.boolean,
			},
			{
				type: Types.array,
				value: {
					type: Types.string,
				},
			},
			{
				type: Types.object,
				value: new Map(),
			},
			{
				type: Types.string,
			},
		]),
	};

	t.deepEqual(sortUnion(union1), sortUnion(union2));
});
