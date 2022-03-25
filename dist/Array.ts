// Package imports
import {JsonAny} from './Any';
import {JsonInfer} from './Json';
import {JsonRequired} from './Required';

// Array class
export class JsonArray<T extends JsonRequired = JsonAny> extends JsonRequired<Array<JsonInfer<T>>>
{
	// Array constructor
	constructor(readonly pattern:Array<T> = [], readonly min?:number, readonly max?:number)
	{
		// Call creation on json
		super([]);

		// If a minimum was specified, and its invalid, throw error
		if(min != undefined && isNaN(min))
			throw new Error('Invalid minimum');

		// If a maximum was specified, and its invalid, throw error
		if(max != undefined && isNaN(max))
			throw new Error('Invalid maximum');

		// If a minimum and maximum were specified, and theyre invalid, throw error
		if(min != undefined && max != undefined && min > max)
			throw new Error('Invalid range');
	}

	// Function to set the specified array
	override set(value:Array<JsonInfer<T>>) { super.set([...value]); }

	// Function to validate the specified array
	validate(value:Array<JsonInfer<T>>):void
	{
		// If the array has a minimum, and the specified length is below it, throw error
		if(this.min != undefined && value.length < this.min)
			throw new Error('Below minimum');

		// If the array has a maximum, and the specified length is above it, throw error
		if(this.max != undefined && value.length > this.max)
			throw new Error('Above maximum');

		// Loop through specified arrays values and validate
		for(let i:number = 0; i < value.length; i++)
		{
			// Attempt to validate the specified arrays value
			try
			{
				// Acquire this json and attempt to parse it
				const json:JsonRequired = this.pattern.length > 0 ? this.pattern[i % this.pattern.length] : new JsonAny();
				json.parse(value[i]);
			}
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