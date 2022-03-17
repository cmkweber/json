// Package imports
import {Json, JsonInfer} from './Json';

// Optional class
export class JsonOptional<T extends Json> extends Json<JsonInfer<T>>
{
	// Optional constructor
	constructor(readonly json:T, value?:JsonInfer<T>)
	{
		// Call creation on json
		super();

		// If a value was specified, set it
		if(value != undefined)
			this.set(value);
	}

	// Function to get the optionals value
	override get():JsonInfer<T> { return this.json.get() as JsonInfer<T>; } /* */

	// Function to set the optionals value
	override set(value:JsonInfer<T>):void { this.json.set(value); }

	// Function to parse the specified value
	parse(value:any):void { this.json.parse(value); }
}