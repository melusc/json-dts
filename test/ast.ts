import test from 'ava';

import {
toAst, Types, type Ast, type ObjectValueAst,
} from '../src/ast.js';

test('number', t => {
	t.deepEqual<Ast, Ast>(toAst(2), {
		type: Types.number,
	});
});

test('null', t => {
	t.deepEqual<Ast, Ast>(toAst(null), {
		type: Types.null,
	});
});

test('boolean', t => {
	t.deepEqual<Ast, Ast>(toAst(true), {
		type: Types.boolean,
	});
});

test('string', t => {
	t.deepEqual<Ast, Ast>(toAst('abc'), {
		type: Types.string,
	});
});

test('array', t => {
	t.deepEqual<Ast, Ast>(toAst([1, 2, 3]), {
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

	t.deepEqual<Ast, Ast>(toAst([]), {
		type: Types.array,
		value: {
			type: Types.any,
		},
	});
});

test('object', t => {
	t.deepEqual<Ast, Ast>(
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
	t.deepEqual<Ast, Ast>(
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
