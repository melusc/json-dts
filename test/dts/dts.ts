import test from 'ava';

import {Types, toAst} from '../../src/ast.js';
import {toDts} from '../../src/dts/dts.js';

test('No objects', t => {
	t.is(toDts(toAst(0)), 'type T0 = number;\n');
	t.is(toDts(toAst(true)), 'type T0 = boolean;\n');
	t.is(toDts(toAst('string\n')), 'type T0 = string;\n');
	t.is(toDts(toAst(null)), 'type T0 = null;\n');
	t.is(toDts({type: Types.any}), 'type T0 = any;\n');
	t.is(toDts(toAst([])), 'type T0 = any[];\n');
});

test('Union', t => {
	t.is(toDts(toAst([0, true])), 'type T0 = Array<number | boolean>;\n');
});

test('Simple object', t => {
	const ast = toAst({
		a: 0,
		b: true,
	});

	t.is(
		toDts(ast),
		`
type T0 = {
	a: number;
	b: boolean;
};
`.trimStart(),
	);
});

test('Nested object', t => {
	t.snapshot(
		toDts(
			toAst([
				{
					a: 0,
					b: [1],
					c: {
						a: 0,
					},
					d: {
						c: {
							a: 0,
						},
					},
				},
			]),
		),
	);

	t.snapshot(
		toDts(
			toAst({
				multiWordKey: [
					[
						{
							snake_case: {
								snake_case_unmodified: true,
							},
							'kebab-case': {
								'kebab-case-unmodified': true,
							},
						},
					],
				],
			}),
		),
	);
});
