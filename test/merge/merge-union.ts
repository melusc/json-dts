import test from 'ava';
import {Types, type UnionAst} from '../../src/ast.js';

import {mergeUnion} from '../../src/merge/merge-union.js';

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

	t.deepEqual(mergeUnion(input), expected);
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

	t.deepEqual(mergeUnion(input), expected);
});
