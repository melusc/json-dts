import test from 'ava';
import {jsonDts} from '../src/index.js';

test('jsonDts', t => {
	t.is(jsonDts([1, 2, 3]), 'type T0 = number[];\n');
	t.is(jsonDts([true, 0]), 'type T0 = Array<boolean | number>;\n');
	t.is(jsonDts([0, true]), 'type T0 = Array<boolean | number>;\n');
	t.snapshot(jsonDts([{x: {y: 1}}]));
	t.snapshot(jsonDts([{x: {y: 1}}], {name: 'X'}));
	t.snapshot(jsonDts([{x: {y: 1}}], {name: 'Y'}));
	t.snapshot(jsonDts([{x: {y: 1}}], {name: 'T'}));
	t.snapshot(jsonDts([{x: 1}], {name: 't'}));
	t.snapshot(jsonDts({x: 1}, {name: 't'}));
	t.snapshot(jsonDts({t: {t: 1}}, {name: 't'}));

	t.throws(() => {
		jsonDts({}, {name: '1a'});
	});
	t.throws(() => {
		jsonDts({}, {name: '_ü'});
	});
});
