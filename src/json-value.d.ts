export type JsonValue =
	| number
	| null
	| string
	| boolean
	| JsonObject
	| JsonArray;

export type JsonArray = readonly JsonValue[];
export type JsonObject = {
	[key: string]: JsonValue;
};
