/*!
 * This file is part of @lusc/json-dts, a JSON to TypeScript definitions converter.
 * Copyright (C) 2026, Luca Schnellmann <oss@lusc.ch>

 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import {toAst, type Ast} from './ast.js';
import {toDts} from './dts/dts.js';
import {type Filter} from './filter.js';
import type {JsonValue} from './json-value.js';
import {simplify} from './simplify/index.js';

export * from './ast.js';

type Options = {
	name: string;
	filter: Filter;
};

export function jsonAst(input: JsonValue, options?: Partial<Options>): Ast {
	const ast = toAst(input, options?.filter);

	return simplify(ast);
}

export function jsonDts(input: JsonValue, options?: Partial<Options>): string {
	const ast = jsonAst(input, options);

	return toDts(ast, options?.name);
}
