import camelCase from 'camelcase';

import {
	type AnyAst,
	type ArrayAst,
	type Ast,
	type BooleanAst,
	type NullAst,
	type NumberAst,
	type ObjectAst,
	type StringAst,
	type UnionAst,
} from '../ast.js';
import {isArray, isObject, isPrimitive, isUnion} from '../util.js';

import {getVariableName} from './get-variable-name.js';

function isValidVariableName(name: string) {
	return /^[_a-z]\w*$/i.test(name);
}

function toKey(key: string) {
	if (isValidVariableName(key)) {
		return key;
	}

	return JSON.stringify(key);
}

export function isAstEqual(ast1: Ast, ast2: Ast): boolean {
	if (ast1.type !== ast2.type) {
		return false;
	}

	if (isPrimitive(ast1)) {
		return true;
	}

	// ^
	if (isArray(ast1)) {
		return isAstEqual(ast1.value, (ast2 as ArrayAst).value);
	}

	if (isUnion(ast1)) {
		const ast2_ = ast2 as UnionAst;
		if (ast1.value.size !== ast2_.value.size) {
			return false;
		}

		const items1 = [...ast1.value];
		const items2 = [...ast2_.value];

		return items1.every((item, i) => isAstEqual(item, items2[i]!));
	}

	const ast2_ = ast2 as ObjectAst;

	if (ast1.value.size !== ast2_.value.size) {
		return false;
	}

	for (const [key, value1] of ast1.value) {
		if (!ast2_.value.has(key)) {
			return false;
		}

		const value2 = ast2_.value.get(key)!;

		if (value1.optional !== value2.optional) {
			return false;
		}

		if (!isAstEqual(value1.value, value2.value)) {
			return false;
		}
	}

	return true;
}

enum Types {
	object,
	array,
	union,
	primitive,
}

class PrimitiveType {
	readonly type = Types.primitive;

	constructor(
		public readonly ast: BooleanAst | NullAst | AnyAst | StringAst | NumberAst,
	) {}

	toString(): string {
		return this.ast.type;
	}
}

class ObjectType {
	readonly type = Types.object;

	constructor(
		public readonly name: string,
		public readonly values: Map<string, {value: Token; optional: boolean}>,
		public readonly ast: ObjectAst,
	) {}

	toObjectString() {
		return [
			`type ${this.name} = {`,
			...[...this.values].map(
				([key, {value, optional}]) =>
					`\t${toKey(key)}${optional ? '?:' : ':'} ${value.toString()};`,
			),
			'};',
		].join('\n');
	}

	toString(): string {
		return this.name;
	}
}

class ArrayType {
	readonly type = Types.array;

	constructor(public readonly value: Token) {}

	toString(): string {
		if (this.value.type !== Types.union || this.value.value.size <= 1) {
			return [this.value.toString(), '[]'].join('');
		}

		return ['Array<', this.value.toString(), '>'].join('');
	}
}

class UnionType {
	readonly type = Types.union;

	constructor(public readonly value: Set<Token>) {}

	toString(): string {
		if (this.value.size === 0) {
			return 'any';
		}

		return [...this.value].map(token => token.toString()).join(' | ');
	}
}

type Token = PrimitiveType | ObjectType | ArrayType | UnionType;

export function toDts(ast: Ast, name?: string): string {
	if (name !== undefined && !isValidVariableName(name)) {
		throw new Error(`Invalid name "${name}"`);
	}

	const objects: ObjectType[] = [];
	const usedNames = new Set<string>();

	function traverseObject(ast: ObjectAst, key?: string): ObjectType {
		const previousObject = objects.find(t => isAstEqual(t.ast, ast));
		if (previousObject) {
			return previousObject;
		}

		const object = new ObjectType(
			getVariableName(key, usedNames),
			new Map(
				[...ast.value].map(([subKey, {value, optional}]) => [
					subKey,
					{value: traverse(value, subKey), optional},
				]),
			),
			ast,
		);

		objects.push(object);
		return object;
	}

	function traverse(ast: Ast, key?: string): Token {
		if (isPrimitive(ast)) {
			return new PrimitiveType(ast);
		}

		if (isObject(ast)) {
			return traverseObject(ast, key);
		}

		if (isUnion(ast)) {
			return new UnionType(new Set([...ast.value].map(v => traverse(v, key))));
		}

		return new ArrayType(traverse(ast.value, key));
	}

	let stringified: string;

	if (isObject(ast)) {
		traverse(ast, name);
		stringified = objects.map(o => o.toObjectString()).join('\n\n');
	} else {
		if (name) {
			name = camelCase(name, {pascalCase: true});
			usedNames.add(name);
		} else {
			usedNames.add('T0');
		}

		const t0 = traverse(ast, name);
		stringified = [
			...objects.map(o => o.toObjectString()),
			`type ${name ?? 'T0'} = ${t0.toString()};`,
		].join('\n\n');
	}

	return `${stringified}\n`;
}
