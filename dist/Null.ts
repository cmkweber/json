// Package imports
import {JsonRequired} from './Required';

// Null class
export class JsonNull extends JsonRequired<null>
{
	// Null members
	#value:null = null;

	// Function to get the nulls value
	get():null { return this.#value; }

	// Function to set the nulls value
	set(value:null) { this.#value = value; }

	// Function to parse the specified value
	parse(value:any):void
	{
		// If the specified value isnt a null, throw error
		if(value !== null)
			throw new Error('Invalid type');

		// Set the specified value
		this.set(value);
	}
}