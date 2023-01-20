import test from 'ava';
import {getVariableName} from '../../src/dts/get-variable-name.js';

test('getName', t => {
	const scope = new Set<string>();

	t.is(getVariableName(undefined, scope), 'T0');
	t.is(getVariableName(undefined, scope), 'T1');
	t.is(getVariableName(undefined, scope), 'T2');

	t.is(getVariableName('many-words-here', scope), 'ManyWordsHere');
	t.is(getVariableName('many-words-here', scope), 'ManyWordsHere1');
	t.is(getVariableName('many-words_here', scope), 'ManyWordsHere2');

	t.is(getVariableName('?QPf3<', scope), 'QPf3');
	t.is(getVariableName('?QPf3<', scope), 'QPf31');
	t.is(getVariableName('?QPf3<', scope), 'QPf32');

	t.is(getVariableName('Vvp`Cii', scope), 'VvpCii');

	t.is(getVariableName('1aji', scope), '_1Aji');
});
