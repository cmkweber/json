// Package imports
import {Json, JsonInfer} from './Json';
import {JsonRequired} from './Required';

// Optional class
export class JsonOptional<T extends JsonRequired = JsonRequired> extends Json<JsonInfer<T>>
{
	// Optional members
	readonly #required:boolean = false;

	// Optional constructor
	constructor(readonly json:T)
	{
		// Call creation on json
		super(json.get() as JsonInfer<T>);

		// Set that the json is optional
		this.#required;
	}

	// Function to get the optionals value
	override get():JsonInfer<T> { return this.json.get() as JsonInfer<T>; };

	// Function to set the specified value
	override set(value:JsonInfer<T>) { this.json.set(value); }

	// Function to validate the specified value
	validate(value:JsonInfer<T>):void { this.json.validate(value); }

	// Function to parse the specified value
	parse(value:any):void { this.json.parse(value); }
}