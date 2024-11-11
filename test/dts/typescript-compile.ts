import {randomBytes} from 'node:crypto';
import {mkdir, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

import {fc, testProp} from '@fast-check/ava';
import test from 'ava';
import type {JsonValue} from 'type-fest';
import * as ts from 'typescript';

import {jsonDts} from '../../src/index.js';

// Taken and adapted from
// <https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API#a-minimal-compiler>
function compile(file: URL): void {
	const program = ts.createProgram([fileURLToPath(file)], {
		strict: true,
		target: ts.ScriptTarget.ESNext,
		module: ts.ModuleKind.NodeNext,
		moduleResolution: ts.ModuleResolutionKind.NodeNext,
		noEmit: true,
	});
	const emitResult = program.emit();

	const allDiagnostics = [
		...ts.getPreEmitDiagnostics(program),
		...emitResult.diagnostics,
	];

	const errors = allDiagnostics.filter(
		diagnostic =>
			// Treat warnings as errors since there
			// shouldn't be any warnings either
			diagnostic.category === ts.DiagnosticCategory.Error ||
			diagnostic.category === ts.DiagnosticCategory.Warning,
	);

	if (errors.length > 0) {
		const message = ts.formatDiagnosticsWithColorAndContext(errors, {
			getCurrentDirectory: ts.sys.getCurrentDirectory,
			getCanonicalFileName: fileName => fileName,
			getNewLine: () => '\n',
		});

		throw new Error(message);
	}
}

const outDirectory = new URL('fast-check-out/', import.meta.url);
await mkdir(outDirectory);

async function compileSource(source: string, prefix: string) {
	// The benefit of this vs fs.mktemp
	// is here I can work with URLs
	// and mkdtemp requires a string
	const directory = new URL(
		`${prefix}-${randomBytes(4).toString('hex')}/`,
		outDirectory,
	);
	await mkdir(directory);

	const sourceFilePath = new URL('file.ts', directory);
	await writeFile(sourceFilePath, source);

	compile(sourceFilePath);
}

async function testWithTypescript(input: unknown, ast: string, prefix: string) {
	const source = `
${ast}

const json: T0 = ${JSON.stringify(input, undefined, '\t')};
`;

	return compileSource(source, prefix);
}

function hasSpecialKeys(item: unknown): boolean {
	if (Array.isArray(item)) {
		for (const value of item) {
			if (hasSpecialKeys(value)) {
				return true;
			}
		}
	} else if (typeof item === 'object' && item !== null) {
		if ('toString' in item) {
			return true;
		}

		for (const value of Object.values(item)) {
			if (hasSpecialKeys(value)) {
				return true;
			}
		}
	}

	return false;
}

testProp(
	'object',
	[fc.dictionary(fc.string(), fc.jsonValue())],
	async (t, dictionary) => {
		// TODO: remove when it can handle toString
		if (hasSpecialKeys(t)) {
			t.pass('Cannot handle toString :(');
			return;
		}

		await t.notThrowsAsync(async () =>
			testWithTypescript(
				dictionary,
				jsonDts(dictionary as JsonValue),
				'object',
			),
		);
	},
	{
		numRuns: 15,
	},
);

testProp(
	'array',
	[fc.array(fc.jsonValue())],
	async (t, array) => {
		// TODO: remove when it can handle toString
		if (hasSpecialKeys(t)) {
			t.pass('Cannot handle toString :(');
			return;
		}

		await t.notThrowsAsync(async () =>
			testWithTypescript(array, jsonDts(array as JsonValue[]), 'array'),
		);
	},
	{
		numRuns: 15,
	},
);

test.failing('toString key incompatibility', async t => {
	// @ts-expect-error Here these two aren't assignable to each other either
	const input = [{}, {toString: false}];

	await t.notThrowsAsync(async () =>
		testWithTypescript(
			input,
			// @ts-expect-error TODO: Objects have `toString(): string`
			// so these two objects are incompatible.
			// I'm unsure how to fix this right now, though.
			jsonDts(input),
			'temp',
		),
	);
});

test('compile() should throw on type error', async t => {
	await t.throwsAsync(async () =>
		compileSource('const x: string = 0;', 'compile-type-error'),
	);
});
