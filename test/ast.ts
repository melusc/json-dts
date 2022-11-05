import test from 'ava';

import {Ast, toAst, Types} from '../src/ast.js';

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
	t.deepEqual<Ast, Ast>(toAst([1,2,3], ), {
		type: Types.array,
		value: [
			{
				type: Types.number,
			},
			{
				type: Types.number,
			},
			{
				type: Types.number,
			},
		]
	})
})
