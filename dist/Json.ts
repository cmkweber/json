// Json types
export type JsonInfer<T extends Json<any>> = T extends {get():infer G} ? G : never;
export type JsonValue = Array<JsonValue>|boolean|null|number|{[key:string]:JsonValue}|string;

// Json class
export abstract class Json<T extends JsonValue>
{
	// Function to get the jsons value
	abstract get():T;

	// Function to set the jsons value
	abstract set(value:T):void;

	// Function to parse the specified value
	abstract parse(value:any):void;
}