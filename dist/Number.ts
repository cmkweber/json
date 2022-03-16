// Package imports
import {Json} from './Json';

// Number class
export class JsonNumber extends Json<number>
{
	// Number constructor
	constructor(readonly integer?:boolean, readonly min?:number, readonly max?:number, value?:number)
	{
		// Call creation on json
		super();

		// If a minimum was specified, and its invalid, throw error
		if(min != undefined && (isNaN(min) || (integer != undefined && integer && !Number.isSafeInteger(min))))
			throw new Error('Invalid minimum');

		// If a maximum was specified, and its invalid, throw error
		if(max != undefined && (isNaN(max) || (integer != undefined && integer && !Number.isSafeInteger(max))))
			throw new Error('Invalid maximum');

		// If a minimum and maximum were specified, and theyre invalid, throw error
		if(min != undefined && max != undefined && min > max)
			throw new Error('Invalid range');

		// If a value was specified, set it
		if(value != undefined)
			this.set(value);
	}

	// Function to set the numbers value
	override set(value:number):void
	{
		// If the specified value isnt a valid number, throw error
		if(isNaN(value))
			throw new Error('Invalid number');

		// If the number is an integer, and the specified value isnt an integer, throw error
		if(this.integer != undefined && this.integer && !Number.isSafeInteger(value))
			throw new Error('Invalid integer');

		// If the number has a minimum, and the specified value is below it, throw error
		if(this.min != undefined && value < this.min)
			throw new Error('Below minimum');

		// If the number has a maximum, and the specified value is above it, throw error
		if(this.max != undefined && value > this.max)
			throw new Error('Above maximum');

		// Call set on json
		super.set(value);
	}

	// Function to parse the specified value
	parse(value:any):void
	{
		// If the specified value isnt a number, throw error
		if(typeof value != 'number')
			throw new Error('Invalid type');

		// Set the specified value
		this.set(value);
	}
}