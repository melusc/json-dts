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

import {toAst, Types, type Ast, type ObjectValueAst} from '../../src/ast.js';
import {mergeObject} from '../../src/simplify/merge-object.js';

test('Single object', t => {
	const ast = toAst([
		null,
		{
			a: 0,
			b: false,
		},
		true,
	]);

	t.deepEqual(mergeObject(ast), {
		type: Types.array,
		value: {
			type: Types.union,
			value: new Set([
				{
					type: Types.null,
				},
				{
					type: Types.object,
					value: new Map<string, ObjectValueAst>([
						[
							'a',
							{
								type: Types.objectValue,
								optional: false,
								value: {
									type: Types.number,
								},
							},
						],
						[
							'b',
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
				{
					type: Types.boolean,
				},
			]),
		},
	});
});

test('Multiple objects with same keys and types', t => {
	const ast = toAst([
		false,
		{
			a: false,
			b: null,
		},
		{
			a: true,
			b: null,
		},
		{
			a: false,
			b: null,
		},
		0,
	]);

	t.deepEqual(mergeObject(ast), {
		type: Types.array,
		value: {
			type: Types.union,
			value: new Set([
				{
					type: Types.boolean,
				},
				{
					type: Types.object,
					value: new Map<string, ObjectValueAst>([
						[
							'a',
							{
								type: Types.objectValue,
								optional: false,
								/*
									The nested unions can be simplified,
									but another function does that
								*/
								value: {
									type: Types.union,
									value: new Set([
										{
											type: Types.union,
											value: new Set([
												{
													type: Types.boolean,
												},
												{
													type: Types.boolean,
												},
											]),
										},
										{
											type: Types.boolean,
										},
									]),
								},
							},
						],
						[
							'b',
							{
								type: Types.objectValue,
								optional: false,
								value: {
									type: Types.union,
									value: new Set([
										{
											type: Types.union,
											value: new Set([
												{
													type: Types.null,
												},
												{
													type: Types.null,
												},
											]),
										},
										{
											type: Types.null,
										},
									]),
								},
							},
						],
					]),
				},
				{
					type: Types.number,
				},
			]),
		},
	});
});

test('Objects with optional keys', t => {
	const ast = toAst([
		{
			a: 'abc',
		},
		{
			a: 'def',
			b: null,
		},
		{
			a: 'ghi',
			c: false,
		},
	]);

	t.deepEqual(mergeObject(ast), {
		type: Types.array,
		value: {
			type: Types.union,
			value: new Set([
				{
					type: Types.object,
					value: new Map<string, ObjectValueAst>([
						[
							'a',
							{
								type: Types.objectValue,
								optional: false,
								value: {
									type: Types.union,
									value: new Set([
										{
											type: Types.union,
											value: new Set([
												{
													type: Types.string,
												},
												{
													type: Types.string,
												},
											]),
										},
										{
											type: Types.string,
										},
									]),
								},
							},
						],
						[
							'b',
							{
								type: Types.objectValue,
								optional: true,
								value: {
									type: Types.union,
									value: new Set([{type: Types.null}]),
								},
							},
						],
						[
							'c',
							{
								type: Types.objectValue,
								optional: true,
								value: {
									type: Types.union,
									value: new Set([{type: Types.boolean}]),
								},
							},
						],
					]),
				},
			]),
		},
	});
});

test('Objects with initially optional keys', t => {
	/*
		{
			a?: string;
		} | {
			a: boolean
		}
		=>
		{
			a?: string | boolean
		}
	*/
	const ast: Ast = {
		type: Types.union,
		value: new Set([
			{
				type: Types.object,
				value: new Map<string, ObjectValueAst>([
					[
						'a',
						{
							type: Types.objectValue,
							optional: true,
							value: {
								type: Types.string,
							},
						},
					],
				]),
			},
			{
				type: Types.object,
				value: new Map<string, ObjectValueAst>([
					[
						'a',
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
	};

	t.deepEqual(mergeObject(ast), {
		type: Types.union,
		value: new Set([
			{
				type: Types.object,
				value: new Map<string, ObjectValueAst>([
					[
						'a',
						{
							type: Types.objectValue,
							optional: true,
							value: {
								type: Types.union,
								value: new Set([
									{
										type: Types.string,
									},
									{
										type: Types.boolean,
									},
								]),
							},
						},
					],
				]),
			},
		]),
	});
});
