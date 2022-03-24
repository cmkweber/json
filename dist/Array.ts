// Package imports
import {JsonAny} from './Any';
import {JsonInfer} from './Json';
import {JsonRequired} from './Required';

// Array class
export class JsonArray<T extends JsonRequired = JsonAny> extends JsonRequired<Array<JsonInfer<T>>>
{
	// Array members
	#value:Array<JsonInfer<T>> = [];

	// Array constructor
	constructor(readonly pattern:Array<T> = [], readonly min?:number, readonly max?:number, value?:Array<JsonInfer<T>>)
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

	// Function to get the arrays value
	get():Array<JsonInfer<T>> { return this.#value; }

	// Function to set the arrays value
	set(value:Array<JsonInfer<T>>):void
	{
		// If the array has a minimum, and the specified length is below it, throw error
		if(this.min != undefined && value.length < this.min)
			throw new Error('Below minimum');

		// If the array has a maximum, and the specified length is above it, throw error
		if(this.max != undefined && value.length > this.max)
			throw new Error('Above maximum');

		// Create an array to store values
		const values:Array<JsonInfer<T>> = [];

		// Loop through specified arrays values and collect
		for(let i:number = 0; i < value.length; i++)
		{
			// Attempt to collect the specified arrays value
			try
			{
				// Acquire this json
				const json:JsonRequired = this.pattern.length > 0 ? this.pattern[i % this.pattern.length] : new JsonAny();

				// Attempt to parse the specified arrays value
				json.parse(value[i]);

				// Add value to values
				values.push(json.get() as JsonInfer<T>);
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

		// Store values
		this.#value = values;
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