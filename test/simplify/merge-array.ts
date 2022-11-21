import test from 'ava';

import {toAst, Types, type Ast} from '../../src/ast.js';

import {mergeArray} from '../../src/simplify/merge-array.js';

test('Single array', t => {
	const ast = toAst([[0, true]]);

	t.deepEqual<Ast, Ast>(mergeArray(ast), {
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

	t.deepEqual<Ast, Ast>(mergeArray(ast), {
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
