import {randomBytes} from 'node:crypto';
import {mkdir, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

import {fc, testProp} from '@fast-check/ava';
import type {JsonValue} from 'type-fest';
import ts from 'typescript';

import {jsonDts} from '../../src/index.js';

// Taken and adapted from
// <https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API#a-minimal-compiler>
function compile(file: URL): void {
	const program = ts.createProgram([fileURLToPath(file)], {
		strict: true,
		target: ts.ScriptTarget.ESNext,
		module: ts.ModuleKind.ESNext,
		noEmit: true,
	});
	const emitResult = program.emit();

	const allDiagnostics = [
		...ts.getPreEmitDiagnostics(program),
		...emitResult.diagnostics,
	];

	for (const diagnostic of allDiagnostics) {
		if (diagnostic.file) {
			const {line, character} = ts.getLineAndCharacterOfPosition(
				diagnostic.file,
				diagnostic.start!,
			);
			const message = ts.flattenDiagnosticMessageText(
				diagnostic.messageText,
				'\n',
			);
			console.log(
				`${diagnostic.file.fileName} (${line + 1},${
					character + 1
				}): ${message}`,
			);
		} else {
			console.log(
				ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
			);
		}
	}
}

const outDir = new URL('fast-check-out/', import.meta.url);
await mkdir(outDir);

async function testWithTypescript(input: any, ast: string, prefix: string) {
	const source = `
${ast}

const json: T0 = ${JSON.stringify(input, undefined, '\t')};
`;

	// The benefit of this vs fs.mktemp
	// is here I can work with URLs
	// and mkdtemp requires a string
	const dir = new URL(`${prefix}-${randomBytes(4).toString('hex')}/`, outDir);
	await mkdir(dir);

	const sourceFilePath = new URL('file.ts', dir);
	await writeFile(sourceFilePath, source);

	compile(sourceFilePath);
}

testProp(
	'object',
	[fc.dictionary(fc.string(), fc.jsonValue())],
	async (t, dict) => {
		t.timeout(100_000);

		await t.notThrowsAsync(async () =>
			testWithTypescript(dict, jsonDts(dict as JsonValue), 'object'),
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
		await t.notThrowsAsync(async () =>
			testWithTypescript(array, jsonDts(array as JsonValue[]), 'array'),
		);
	},
	{
		numRuns: 15,
	},
);
