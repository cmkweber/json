// Package imports
import {JsonRequired} from './Required';

// String class
export class JsonString extends JsonRequired<string, string>
{
	// String constructor
	constructor(readonly pattern?:RegExp) { super(''); }

	// Function to validate the strings value
	validate():void
	{
		// If the string has a pattern, and the value doesnt match, throw error
		if(this.pattern != undefined && !this.pattern.test(this.value))
			throw new Error('Invalid pattern');
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

	// Function to serialize the strings value
	serialize():string { return this.value; }
}