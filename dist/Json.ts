// Json types
export type JsonInfer<T> = T extends Json<infer T> ? T : never;
export type JsonValue = Array<JsonValue>|boolean|null|number|{[key:string]:JsonValue}|string;

// Json class
export abstract class Json<T extends JsonValue = JsonValue>
{
	// Json members
	#value:T;

	// Json constructor
	constructor(value:T) { this.#value = value; }

	// Function to get the jsons value
	get():T { return this.#value; };

	// Function to set the specified value
	set(value:T):void
	{
		// Attempt to validate the specified value
		this.validate(value);

		// Store the specified value
		this.#value = value;
	}

	// Function to validate the jsons value
	abstract validate(value:T):void;

	// Function to parse the specified value
	abstract parse(value:any):void;
}