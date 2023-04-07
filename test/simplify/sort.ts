import test from 'ava';

import {Types, type Ast, type UnionAst} from '../../src/ast.js';
import {sortUnion} from '../../src/simplify/sort.js';

test('Two unions should sort the same', t => {
	const union1: UnionAst = {
		type: Types.union,
		value: new Set([
			{
				type: Types.string,
			},
			{
				type: Types.boolean,
			},
			{
				type: Types.null,
			},
			{
				type: Types.object,
				value: new Map(),
			},
			{
				type: Types.array,
				value: {
					type: Types.string,
				},
			},
		]),
	};
	const union2: UnionAst = {
		type: Types.union,
		value: new Set([
			{
				type: Types.null,
			},
			{
				type: Types.boolean,
			},
			{
				type: Types.array,
				value: {
					type: Types.string,
				},
			},
			{
				type: Types.object,
				value: new Map(),
			},
			{
				type: Types.string,
			},
		]),
	};

	t.deepEqual<Ast, Ast>(sortUnion(union1), sortUnion(union2));
});
