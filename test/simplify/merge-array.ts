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
import {mergeArray} from '../../src/simplify/merge-array.js';

test('Single array', t => {
	const ast = toAst([[0, true]]);

	t.deepEqual(mergeArray(ast), {
		type: Types.array,
		value: {
			type: Types.union,
			value: new Set([
				{
					type: Types.array,
					value: {
						type: Types.union,
						value: new Set([
							{
								type: Types.number,
							},
							{
								type: Types.boolean,
							},
						]),
					},
				},
			]),
		},
	});
});

test('Multiple arrays', t => {
	const ast = toAst(['abc', [0], true, [1], [true, null]]);

	t.deepEqual(mergeArray(ast), {
		type: Types.array,
		value: {
			type: Types.union,
			value: new Set([
				{
					type: Types.string,
				},
				{
					type: Types.array,
					value: {
						type: Types.union,
						value: new Set([
							{
								type: Types.union,
								value: new Set([
									{
										type: Types.number,
									},
								]),
							},
							{
								type: Types.union,
								value: new Set([
									{
										type: Types.number,
									},
								]),
							},
							{
								type: Types.union,
								value: new Set([
									{
										type: Types.boolean,
									},
									{
										type: Types.null,
									},
								]),
							},
						]),
					},
				},
				{
					type: Types.boolean,
				},
			]),
		},
	});
});
