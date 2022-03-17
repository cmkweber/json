// Package imports
import {JsonRequired} from './Required';

// String class
export class JsonString extends JsonRequired
{
	// String members
	#value:string = '';

	// String constructor
	constructor(readonly pattern?:RegExp, value?:string)
	{
		// Call creation on json
		super();

		// If a value was specified, set it
		if(value != undefined)
			this.set(value);
	}

	// Function to get the strings value
	get():string { return this.#value; }

	// Function to set the strings value
	set(value:string):void
	{
		// If the string has a pattern, and the specified value doesnt match, throw error
		if(this.pattern != undefined && !this.pattern.test(value))
			throw new Error('Invalid pattern');

		// Store the specified value
		this.#value = value;
	}

	// Function to parse the specified value
	parse(value:any):void
	{
		// If the specified value isnt a string, throw error
		if(typeof value != 'string')
			throw new Error('Invalid type');

		// Set the specified value
		this.set(value);
	}
}