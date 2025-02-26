# @lusc/json-dts

Convert JSON to TypeScript definitions (.d.ts).

## Install

```sh
npm install @lusc/json-dts

# or using yarn
yarn add @lusc/json-dts
```

## Usage

```js
import {jsonDts} from '@lusc/json-dts';

jsonDts({key: 'value'});
/*
type T0 = {
	key: string;
};
*/

jsonDts({key: {nested_key: 'value'}});
/*
type Key = {
	nested_key: string;
};

type T0 = {
	key: Key;
};
*/

jsonDts({key: true}, {name: 'data'});
/*
type Data = {
	key: boolean
}
*/
```

## API

### jsonDts(input, options?)

#### input

Anything that can be represented as JSON.

Has to be parsed JSON.

#### options.name?

Type: `string`

By default the the root item is called `T0`. This can be used to override that.

#### options.filter?

Type: `string[] | (path: string[]) => boolean`

This option can be used to filter entries from the output. Filtered entries will have type `any`.

For each key (including indices of arrays) found in `input`:

- If the filter is an array, it filters all keys found in that array.
- Otherwise it passes the path the function and filters that key if the function returns `false`.

```ts
jsonDts(
  {
    a: 1,
    b: 'b',
  },
  {
    filter: ['a'],
  },
);
// returns
type T0 = {
  a: any;
  b: string;
};

jsonDts(
  {
    a: {
      b: 'b',
      c: 1,
    },
  },
  {
    filter(path: string[]) {
      // Filter *.b
      return path?.[1] !== 'b';
    },
  },
);
// returns
type A = {
  b: any;
  c: number;
};

type T0 = {
  a: A;
};
```
