// Package imports
import {JsonRequired} from './Required';

// Null class
export class JsonNull extends JsonRequired<null>
{
	// Null constructor
	constructor() { super(null); }

	// Function to validate the specified null
	validate(value:null) { value; }

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