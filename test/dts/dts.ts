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

import {Types, toAst} from '../../src/ast.js';
import {toDts} from '../../src/dts/dts.js';

test('No objects', t => {
	t.is(toDts(toAst(0)), 'type T0 = number;\n');
	t.is(toDts(toAst(true)), 'type T0 = boolean;\n');
	t.is(toDts(toAst('string\n')), 'type T0 = string;\n');
	t.is(toDts(toAst(null)), 'type T0 = null;\n');
	t.is(toDts({type: Types.any}), 'type T0 = any;\n');
	t.is(toDts(toAst([])), 'type T0 = any[];\n');
});

test('Union', t => {
	t.is(toDts(toAst([0, true])), 'type T0 = Array<number | boolean>;\n');
});

test('Simple object', t => {
	const ast = toAst({
		a: 0,
		b: true,
	});

	t.is(
		toDts(ast),
		`
type T0 = {
	a: number;
	b: boolean;
};
`.trimStart(),
	);
});

test('Nested object', t => {
	t.snapshot(
		toDts(
			toAst([
				{
					a: 0,
					b: [1],
					c: {
						a: 0,
					},
					d: {
						c: {
							a: 0,
						},
					},
				},
			]),
		),
	);

	t.snapshot(
		toDts(
			toAst({
				multiWordKey: [
					[
						{
							snake_case: {
								snake_case_unmodified: true,
							},
							'kebab-case': {
								'kebab-case-unmodified': true,
							},
						},
					],
				],
			}),
		),
	);
});
