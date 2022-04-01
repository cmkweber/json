// Package imports
import {JsonRequired} from './Required';

// Boolean class
export class JsonBoolean extends JsonRequired<boolean, boolean>
{
	// Boolean constructor
	constructor(readonly match?:boolean) { super(match !== undefined ? match : false); }

	// Function to validate the booleans value
	protected validate():void
	{
		// If the boolean has a match, and the value doesnt match, throw error
		if(this.match !== undefined && this.value !== this.match)
			throw new Error('Invalid match');
	}

	// Function to parse the specified value
	parse(value:any):void
	{
		// If the specified value isnt a boolean, throw error
		if(typeof value !== 'boolean')
			throw new Error('Invalid type');

		// Set the specified value
		this.set(value);
	}

	// Function to serialize the booleans value
	serialize():boolean { return this.value; }
}