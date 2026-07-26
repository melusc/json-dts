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

test('Paths', t => {
	const paths: string[][] = [];

	jsonDts(
		{
			a: {
				b: [
					{
						c: 1,
					},
				],
				d: 3,
			},
			e: 5,
		},
		{
			filter(path) {
				paths.push(path);
				return true;
			},
		},
	);

	t.deepEqual(paths, [
		['a'],
		['a', 'b'],
		['a', 'b', '0'],
		['a', 'b', '0', 'c'],
		['a', 'd'],
		['e'],
	]);
});

test('Filtering with array', t => {
	t.snapshot(
		jsonDts(
			{
				a: {
					b: 0,
					c: 0,
				},
				b: {
					c: 1,
					d: 1,
				},
				c: {
					e: {
						d: 0,
						b: 0,
					},
				},
			},
			{
				filter: ['b', 'd'],
			},
		),
	);
});

test('Filtering with function', t => {
	t.snapshot(
		jsonDts(
			{
				a: {
					b: 0,
					c: 0,
				},
				b: {
					c: 1,
					d: 1,
				},
				c: {
					e: {
						d: 0,
						b: 0,
					},
				},
			},
			{
				// Limit to depth 3 (root is not listed in array)
				filter: paths => paths.length < 3,
			},
		),
	);
});
