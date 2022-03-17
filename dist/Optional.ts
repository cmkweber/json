// Package imports
import {Json, JsonInfer} from './Json';
import {JsonRequired} from './Required';

// Optional class
export class JsonOptional<T extends JsonRequired = JsonRequired> extends Json
{
	// Optional members
	#defined:boolean = false;
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
	get():JsonInfer<T>|undefined { return this.#defined ? this.json.get() as JsonInfer<T> : undefined; } /* */

	// Function to set the optionals value
	set(value:JsonInfer<T>|undefined):void
	{
		// If a value was specified, set the json to it
		if(value != undefined)
			this.json.set(value);

		// Store whether the optional is defined or not
		this.#defined = value != undefined;
	}

	// Function to parse the specified value
	parse(value:any):void
	{
		// If a value was specified, attempt to parse the json with it
		if(value != undefined)
			this.json.parse(value);

		// Store whether the optional is defined or not
		this.#defined = value != undefined;
	}
}