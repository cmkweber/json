// Json types
export type JsonInput<I> = I extends Json<infer I, JsonValue> ? I : never;
export type JsonOutput<O> = O extends Json<unknown, infer O> ? O : never;
export type JsonValue = Array<JsonValue>|boolean|null|number|{[key:string]:JsonValue}|string;

// Json class
export abstract class Json<I, O extends JsonValue>
{
	// Json members
	#value:I;

	// Json getters
	get value():I { return this.#value; }

	// Json constructor
	constructor(value:I) { this.#value = value; }

	// Function to set the specified value
	set(value:I):void
	{
		// Store the specified value
		this.#value = value;

		// Attempt to validate the specified value
		this.validate();
	}

	// Function to validate the jsons value
	protected abstract validate():void;

	// Function to parse the specified value
	abstract parse(value:any):void;

	// Function to serialize the jsons value
	abstract serialize():O;
}