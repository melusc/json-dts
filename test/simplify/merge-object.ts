import test from 'ava';

import {
toAst, Types, type Ast, type ObjectValueAst,
} from '../../src/ast.js';
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

	t.deepEqual<Ast, Ast>(mergeObject(ast), {
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

	t.deepEqual<Ast, Ast>(mergeObject(ast), {
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

	t.deepEqual<Ast, Ast>(mergeObject(ast), {
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

	t.deepEqual<Ast, Ast>(mergeObject(ast), {
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
