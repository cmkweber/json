// Package imports
import {JsonRequired} from './Required';

// Boolean class
export class JsonBoolean extends JsonRequired<boolean>
{
	// Boolean members
	#value:boolean = false;

	// Boolean constructor
	constructor(readonly match?:boolean, value?:boolean)
	{
		// Call creation on json
		super();

		// If a value was specified, set it
		if(value != undefined)
			this.set(value);
	}

	// Function to get the booleans value
	get():boolean { return this.#value; }

	// Function to set the booleans value
	set(value:boolean):void
	{
		// If the boolean has a match, and the specified value doesnt match, throw error
		if(this.match != undefined && value != this.match)
			throw new Error('Invalid match');

		// Store the specified value
		this.#value = value;
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