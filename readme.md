# @lusc/json-dts

Convert JSON to TypeScript definitions.

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

jsonDts({key: true}, 'data');
/*
type Data = {
	key: boolean
}
*/
```

## API

### jsonDts(input, name?)

#### input

Anything that can be represented as JSON.

Has to be parsed JSON.

#### name

Type: string

By default the the root item is called `T0`. This can be used to override that.
