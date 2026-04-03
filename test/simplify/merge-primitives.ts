import test from 'ava';

import {toAst, Types} from '../../src/ast.js';
import {mergePrimitives} from '../../src/simplify/merge-primitives.js';

test('Array of numbers', t => {
	const ast = toAst([1, 2, 3, 4, 5, 6]);

	t.deepEqual(mergePrimitives(ast), {
		type: Types.array,
		value: {
			type: Types.union,
			value: new Set([{type: Types.number}]),
		},
	});
});

test('Array of booleans and numbers', t => {
	const ast = toAst([1, 2, 3, true, 1, false]);

	t.deepEqual(mergePrimitives(ast), {
		type: Types.array,
		value: {
			type: Types.union,
			value: new Set([{type: Types.number}, {type: Types.boolean}]),
		},
	});
});
