import test from 'ava';
import {jsonDts} from '../src/index.js';

test('Paths', t => {
	const paths: string[][] = [];

	jsonDts(
		{
			a: {
				b: [
					{
						c: 1,
					},
				],
				d: 3,
			},
			e: 5,
		},
		{
			filter(path) {
				paths.push(path);
				return true;
			},
		},
	);

	t.deepEqual(paths, [
		['a'],
		['a', 'b'],
		['a', 'b', '0'],
		['a', 'b', '0', 'c'],
		['a', 'd'],
		['e'],
	]);
});

test('Filtering with array', t => {
	t.snapshot(
		jsonDts(
			{
				a: {
					b: 0,
					c: 0,
				},
				b: {
					c: 1,
					d: 1,
				},
				c: {
					e: {
						d: 0,
						b: 0,
					},
				},
			},
			{
				filter: ['b', 'd'],
			},
		),
	);
});

test('Filtering with function', t => {
	t.snapshot(
		jsonDts(
			{
				a: {
					b: 0,
					c: 0,
				},
				b: {
					c: 1,
					d: 1,
				},
				c: {
					e: {
						d: 0,
						b: 0,
					},
				},
			},
			{
				filter(paths) {
					// Limit to depth 3 (root is not listed in array)
					return paths.length < 3;
				},
			},
		),
	);
});
