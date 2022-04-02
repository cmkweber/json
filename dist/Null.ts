// Package imports
import {JsonRequired} from './Required';

// Null class
export class JsonNull extends JsonRequired<null, null>
{
	// Null constructor
	constructor()
	{
		// Call creation on json
		super(null);

		// Attempt to validate null
		this.validate();
	}

	// Function to validate the nulls value
	protected validate():void {}

	// Function to parse the specified value
	parse(value:any):void
	{
		// If the specified value isnt a null, throw error
		if(value !== null)
			throw new Error('Invalid type');

		// Set the specified value
		this.set(value);
	}

	// Function to serialize the nulls value
	serialize():null { return this.value; }
}