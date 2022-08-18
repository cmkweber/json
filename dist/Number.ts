// Package imports
import {JsonRequired} from './Required';

// Number class
export class JsonNumber extends JsonRequired<number, number>
{
	// Number members
	readonly max?:number;
	readonly min?:number;

	// Number constructor
	constructor(readonly precision:number = 20, min?:number, max?:number, value?:number)
	{
		// If the specified precision is invalid, throw error
		if(isNaN(precision) || precision < 0 || precision > 20 || !Number.isSafeInteger(precision))
			throw new Error('Invalid precision');

		// If a minimum was specified, determine if its valid
		if(min !== undefined)
		{
			// If the minimum is invalid, throw error
			if(isNaN(min))
				throw new Error('Invalid minimum');

			// Clamp the minimum to the specified precision
			min = Number(min.toFixed(precision));
		}

		// If a maximum was specified, determine if its valid
		if(max !== undefined)
		{
			// If the maximum is invalid, throw error
			if(isNaN(max))
				throw new Error('Invalid maximum');

			// Clamp the maximum to the specified precision
			max = Number(max.toFixed(precision));
		}

		// If a minimum and maximum were specified, and theyre invalid, throw error
		if(min !== undefined && max !== undefined && min > max)
			throw new Error('Invalid range');

		// Call creation on json
		super(value !== undefined ? Number(value.toFixed(precision)) : (min !== undefined ? min : 0));

		// If a minimum was specified, store it
		if(min !== undefined)
			this.min = min;

		// If a maximum was specified, store it
		if(max !== undefined)
			this.max = max;

		// If a value was specified, attempt to validate it
		if(value !== undefined)
			this.validate();
	}

	// Function to set the numbers value
	override set(value:number) { super.set(Number(value.toFixed(this.precision))); }

	// Function to validate the numbers value
	protected validate():void
	{
		// If the value isnt a valid number, throw error
		if(isNaN(this.value))
			throw new Error('Invalid number');

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