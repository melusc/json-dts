import test from 'ava';

import {getName, toDts} from '../src/dts.js';
import {Types, toAst} from '../src/ast.js';

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
	t.is(
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
		`
type C = {
	a: number;
};

type D = {
	c: C;
};

type T1 = {
	a: number;
	b: number[];
	c: C;
	d: D;
};

type T0 = T1[];
`.trimStart(),
	);

	t.is(
		toDts(
			toAst({
				multiWordKey: [
					[
						{
							// eslint-disable-next-line @typescript-eslint/naming-convention
							snake_case: {
								// eslint-disable-next-line @typescript-eslint/naming-convention
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
		`
type SnakeCase = {
	snake_case_unmodified: boolean;
};

type KebabCase = {
	"kebab-case-unmodified": boolean;
};

type MultiWordKey = {
	snake_case: SnakeCase;
	"kebab-case": KebabCase;
};

type T0 = {
	multiWordKey: MultiWordKey[][];
};
`.trimStart(),
	);
});

test('getName', t => {
	const scope = new Set<string>();

	t.is(getName(undefined, scope), 'T0');
	t.is(getName(undefined, scope), 'T1');
	t.is(getName(undefined, scope), 'T2');

	t.is(getName('many-words-here', scope), 'ManyWordsHere');
	t.is(getName('many-words-here', scope), 'ManyWordsHere1');
	t.is(getName('many-words_here', scope), 'ManyWordsHere2');
});
