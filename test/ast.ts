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

import {toAst, Types, type Ast, type ObjectValueAst} from '../src/ast.js';

test('number', t => {
	t.deepEqual(toAst(2), {
		type: Types.number,
	});
});

test('null', t => {
	t.deepEqual(toAst(null), {
		type: Types.null,
	});
});

test('boolean', t => {
	t.deepEqual(toAst(true), {
		type: Types.boolean,
	});
});

test('string', t => {
	t.deepEqual(toAst('abc'), {
		type: Types.string,
	});
});

test('array', t => {
	t.deepEqual(toAst([1, 2, 3]), {
		type: Types.array,
		value: {
			type: Types.union,
			value: new Set([
				{
					type: Types.number,
				},
				{
					type: Types.number,
				},
				{
					type: Types.number,
				},
			]),
		},
	});

	t.deepEqual(toAst([]), {
		type: Types.array,
		value: {
			type: Types.any,
		},
	});
});

test('object', t => {
	t.deepEqual(
		toAst({
			a: true,
			b: 0,
			c: 'abc',
			d: null,
		}),
		{
			type: Types.object,
			value: new Map<string, ObjectValueAst>([
				[
					'a',
					{
						type: Types.objectValue,
						optional: false,
						value: {type: Types.boolean},
					},
				],
				[
					'b',
					{
						type: Types.objectValue,
						optional: false,
						value: {type: Types.number},
					},
				],
				[
					'c',
					{
						type: Types.objectValue,
						optional: false,
						value: {type: Types.string},
					},
				],
				[
					'd',
					{type: Types.objectValue, optional: false, value: {type: Types.null}},
				],
			]),
		},
	);
});

test('mixed', t => {
	t.deepEqual(
		toAst({
			a: true,
			b: [
				{
					c: {
						d: [[{g: true}]],
					},
					h: null,
				},
				'abc',
			],
		}),
		{
			type: Types.object,
			value: new Map<string, ObjectValueAst>([
				[
					'a',
					{
						type: Types.objectValue,
						optional: false,
						value: {type: Types.boolean},
					},
				],
				[
					'b',
					{
						type: Types.objectValue,
						optional: false,
						value: {
							type: Types.array,
							value: {
								type: Types.union,
								value: new Set<Ast>([
									{
										type: Types.object,
										value: new Map<string, ObjectValueAst>([
											[
												'c',
												{
													type: Types.objectValue,
													optional: false,
													value: {
														type: Types.object,
														value: new Map<string, ObjectValueAst>([
															[
																'd',
																{
																	type: Types.objectValue,
																	optional: false,
																	value: {
																		type: Types.array,
																		value: {
																			type: Types.union,
																			value: new Set<Ast>([
																				{
																					type: Types.array,
																					value: {
																						type: Types.union,
																						value: new Set<Ast>([
																							{
																								type: Types.object,
																								value: new Map<
																									string,
																									ObjectValueAst
																								>([
																									[
																										'g',
																										{
																											type: Types.objectValue,
																											optional: false,
																											value: {
																												type: Types.boolean,
																											},
																										},
																									],
																								]),
																							},
																						]),
																					},
																				},
																			]),
																		},
																	},
																},
															],
														]),
													},
												},
											],
											[
												'h',
												{
													type: Types.objectValue,
													optional: false,
													value: {type: Types.null},
												},
											],
										]),
									},
									{
										type: Types.string,
									},
								]),
							},
						},
					},
				],
			]),
		},
	);
});
