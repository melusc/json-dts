import test from 'ava';
import {jsonDts} from '../src/index.js';

test('jsonDts', t => {
	t.is(jsonDts([1, 2, 3]), 'type T0 = number[];\n');
	t.is(jsonDts([true, 0]), 'type T0 = Array<boolean | number>;\n');
	t.is(jsonDts([0, true]), 'type T0 = Array<boolean | number>;\n');
	t.snapshot(jsonDts([{x: {y: 1}}]));
	t.snapshot(jsonDts([{x: {y: 1}}], 'X'));
	t.snapshot(jsonDts([{x: {y: 1}}], 'Y'));
	t.snapshot(jsonDts([{x: {y: 1}}], 'T'));
	t.snapshot(jsonDts([{x: 1}], 't'));
	t.snapshot(jsonDts({x: 1}, 't'));
	t.snapshot(jsonDts({t: {t: 1}}, 't'));

	t.throws(() => {
		jsonDts({}, '1a');
	});
	t.throws(() => {
		jsonDts({}, '_ü');
	});
});
