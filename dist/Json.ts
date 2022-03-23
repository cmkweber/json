// Json types
export type JsonInfer<T extends Json> = T extends {get():infer G} ? G : never;
export type JsonValue = Array<JsonValue> | boolean | null | number | {[key:string]:JsonValue} | string;

// Json class
export abstract class Json
{
	// Function to get the jsons value
	abstract get():JsonValue;

	// Function to set the jsons value
	abstract set(value:JsonValue):void;

	// Function to parse the specified value
	abstract parse(value:any):void;
}