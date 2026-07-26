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

import {Types, type Ast, type UnionAst} from '../../src/ast.js';
import {simplifyUnion} from '../../src/simplify/simplify-union.js';

test('Union with unions', t => {
	const input: UnionAst = {
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
						type: Types.boolean,
					},
					{
						type: Types.null,
					},
				]),
			},
		]),
	};

	const expected: UnionAst = {
		type: Types.union,
		value: new Set([
			{
				type: Types.number,
			},
			{
				type: Types.boolean,
			},
			{
				type: Types.null,
			},
		]),
	};

	t.deepEqual(simplifyUnion(input), expected);
});

test('Union with mixed types', t => {
	const input: UnionAst = {
		type: Types.union,
		value: new Set([
			{
				type: Types.boolean,
			},
			{
				type: Types.union,
				value: new Set([
					{
						type: Types.number,
					},
					{
						type: Types.null,
					},
				]),
			},
			{
				type: Types.string,
			},
		]),
	};

	const expected: UnionAst = {
		type: Types.union,
		value: new Set([
			{
				type: Types.boolean,
			},
			{
				type: Types.number,
			},
			{
				type: Types.null,
			},
			{
				type: Types.string,
			},
		]),
	};

	t.deepEqual(simplifyUnion(input), expected);
});

test('Empty union', t => {
	let amountChanges = 0;

	simplifyUnion(
		{
			type: Types.union,
			value: new Set(),
		},
		() => {
			++amountChanges;
		},
	);

	t.is(amountChanges, 0);
});

test('Union with one item', t => {
	const ast: Ast = {
		type: Types.union,
		value: new Set([
			{
				type: Types.union,
				value: new Set([
					{
						type: Types.boolean,
					},
				]),
			},
		]),
	};

	t.deepEqual(simplifyUnion(ast), {
		type: Types.boolean,
	});
});
