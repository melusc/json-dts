import test from 'ava';
import {jsonDts} from '../src/index.js';

test('jsonDts', t => {
	t.is(jsonDts([1, 2, 3]), 'type T0 = number[];\n');
	t.is(jsonDts([true, 0]), 'type T0 = Array<boolean | number>;\n');
	t.is(jsonDts([0, true]), 'type T0 = Array<boolean | number>;\n');
});
