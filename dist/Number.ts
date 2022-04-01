// Package imports
import {JsonRequired} from './Required';

// Number class
export class JsonNumber extends JsonRequired<number, number>
{
	// Number constructor
	constructor(readonly integer?:boolean, readonly min?:number, readonly max?:number)
	{
		// If a minimum was specified, and its invalid, throw error
		if(min !== undefined && (isNaN(min) || (integer !== undefined && integer && !Number.isSafeInteger(min))))
			throw new Error('Invalid minimum');

		// If a maximum was specified, and its invalid, throw error
		if(max !== undefined && (isNaN(max) || (integer !== undefined && integer && !Number.isSafeInteger(max))))
			throw new Error('Invalid maximum');

		// If a minimum and maximum were specified, and theyre invalid, throw error
		if(min !== undefined && max !== undefined && min > max)
			throw new Error('Invalid range');

		// Call creation on json
		super(min !== undefined ? min : (integer ? 0 : 0.0));
	}

	// Function to validate the numbers value
	protected validate():void
	{
		// If the value isnt a valid number, throw error
		if(isNaN(this.value))
			throw new Error('Invalid number');

		// If the number is an integer, and the value isnt an integer, throw error
		if(this.integer !== undefined && this.integer && !Number.isSafeInteger(this.value))
			throw new Error('Invalid integer');

		// If the number has a minimum, and the value is below it, throw error
		if(this.min !== undefined && this.value < this.min)
			throw new Error('Below minimum');

		// If the number has a maximum, and the value is above it, throw error
		if(this.max !== undefined && this.value > this.max)
			throw new Error('Above maximum');
	}

	// Function to parse the specified value
	parse(value:any):void
	{
		// If the specified value isnt a number, throw error
		if(typeof value !== 'number')
			throw new Error('Invalid type');

		// Set the specified value
		this.set(value);
	}

	// Function to serialize the numbers value
	serialize():number { return this.value; }
}