// Package imports
import {Json, JsonInfer} from './Json';

// Array types
type Value<T extends Json> = Array<JsonInfer<T>>

// Array class
export class JsonArray<T extends Json = Json> extends Json<Value<T>>
{
	// Array constructor
	constructor(readonly pattern:Array<T>, readonly min?:number, readonly max?:number, value?:Value<T>)
	{
		// Call creation on json
		super();

		// If a minimum was specified, and its invalid, throw error
		if(min != undefined && isNaN(min))
			throw new Error('Invalid minimum');

		// If a maximum was specified, and its invalid, throw error
		if(max != undefined && isNaN(max))
			throw new Error('Invalid maximum');

		// If a minimum and maximum were specified, and theyre invalid, throw error
		if(min != undefined && max != undefined && min > max)
			throw new Error('Invalid range');

		// If a value was specified, set it
		if(value != undefined)
			this.set(value);
	}

	// Function to set the arrays value
	override set(value:Value<T>):void
	{
		// If the array has a minimum, and the specified length is below it, throw error
		if(this.min != undefined && value.length < this.min)
			throw new Error('Below minimum');

		// If the array has a maximum, and the specified length is above it, throw error
		if(this.max != undefined && value.length > this.max)
			throw new Error('Above maximum');

		// If the array has a pattern, determine if the specified value matches it
		if(this.pattern.length > 0)
		{
			// Loop through specified arrays values and attempt to set
			for(let i:number = 0; i < value.length; i++)
			{
				// Acquire this json
				const json:T = this.pattern[i % this.pattern.length];

				// Attempt to set the specified arrays value
				try {
					json.set(value[i]); }
				// On error, rethrow it
				catch(error)
				{
					// If the error is an error, rethrow it with index information
					if(error instanceof Error)
						throw new Error('[' + i.toString() + ']: ' + error.message);
					// Else, rethrow error
					else
						throw error;
				}
			}
		}

		// Call set on json
		super.set(value);
	}

	// Function to parse the specified value
	parse(value:any):void
	{
		// If the specified value isnt an array, throw error
		if(!Array.isArray(value))
			throw new Error('Invalid type');

		// Set the specified value
		this.set(value);
	}
}