// Json types
export type JsonInfer<T extends Json> = T extends {get(): infer U} ? U : never;
export type JsonValue = Array<JsonValue> | boolean | null | number | {[key:string]:JsonValue} | string;

// Json class
export abstract class Json<T extends JsonValue = JsonValue>
{
	// Json members
	#value:T|undefined;

	// Function to get the jsons value
	get():T
	{
		// If the value hasnt been set, throw error
		if(this.#value == undefined)
			throw new Error('Invalid value');

		// Return success
		return JSON.parse(JSON.stringify(this.#value));
	}

	// Function to set the jsons value
	set(value:T):void { this.#value = value; }

	// Function to parse the specified value
	abstract parse(value:any):void;
}