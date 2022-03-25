// Package imports
import {JsonRequired} from './Required';

// Boolean class
export class JsonBoolean extends JsonRequired<boolean>
{
	// Boolean constructor
	constructor(readonly match?:boolean) { super(false); }

	// Function to validate the specified boolean
	validate(value:boolean):void
	{
		// If the boolean has a match, and the specified value doesnt match, throw error
		if(this.match != undefined && value != this.match)
			throw new Error('Invalid match');
	}

	// Function to parse the specified value
	parse(value:any):void
	{
		// If the specified value isnt a boolean, throw error
		if(typeof value != 'boolean')
			throw new Error('Invalid type');

		// Set the specified value
		this.set(value);
	}
}