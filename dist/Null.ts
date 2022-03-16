// Package imports
import {Json} from './Json';

// Null class
export class JsonNull extends Json<null>
{
	// Null constructor
	constructor(value?:null)
	{
		// Call creation on json
		super();

		// If a value was specified, set it
		if(value != undefined)
			this.set(value);
	}

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