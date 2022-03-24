// Package imports
import {Json, JsonInfer, JsonValue} from './Json';
import {JsonRequired} from './Required';

// Optional class
export class JsonOptional<T extends JsonRequired<JsonValue> = JsonRequired<JsonValue>> extends Json<JsonInfer<T>>
{
	// Optional members
	readonly #required:boolean = false;

	// Optional constructor
	constructor(readonly json:T, value?:JsonInfer<T>)
	{
		// Call creation on json
		super();

		// Set that the json is optional
		this.#required;

		// If a value was specified, set it
		if(value != undefined)
			this.set(value);
	}

	// Function to get the optionals value
	get():JsonInfer<T> { return this.json.get() as JsonInfer<T>; }

	// Function to set the optionals value
	set(value:JsonInfer<T>):void { this.json.set(value); }

	// Function to parse the specified value
	parse(value:any):void { this.json.parse(value); }
}