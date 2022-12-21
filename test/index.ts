import test from 'ava';
import {jsonType} from '../src/index.js';

test('jsonType', t => {
	t.is(jsonType([1, 2, 3]), 'type T0 = number[];\n');
	t.is(jsonType([true, 0]), 'type T0 = Array<boolean | number>;\n');
	t.is(jsonType([0, true]), 'type T0 = Array<boolean | number>;\n');
});
