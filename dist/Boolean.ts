// Package imports
import {JsonRequired} from './Required';

// Boolean class
export class JsonBoolean extends JsonRequired<boolean, boolean>
{
	// Boolean constructor
	constructor(value?:boolean)
	{
		// Call creation on json
		super(value !== undefined ? value : false);

		// If a value was specified, attempt to validate it
		if(value !== undefined)
			this.validate();
	}

	// Function to validate the booleans value
	protected validate():void {}

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