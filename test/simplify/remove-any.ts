import test from 'ava';
import {Types, type Ast} from '../../src/ast.js';
import {removeAny} from '../../src/simplify/remove-any.js';

test('removeAny', t => {
	t.plan(2);

	t.deepEqual<Ast, Ast>(
		removeAny(
			{
				type: Types.union,
				value: new Set([
					{
						type: Types.boolean,
					},
					{
						type: Types.any,
					},
				]),
			},
			t.pass,
		),
		{
			type: Types.union,
			value: new Set([
				{
					type: Types.boolean,
				},
			]),
		},
	);

	removeAny(
		{
			type: Types.union,
			value: new Set([
				{
					type: Types.string,
				},
			]),
		},
		t.fail,
	);
});
