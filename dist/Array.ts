// Package imports
import {JsonAny} from './Any';
import {JsonInput, JsonOutput, JsonValue} from './Json';
import {JsonRequired} from './Required';

// Array class
export class JsonArray<T extends JsonRequired<any, JsonValue> = JsonAny> extends JsonRequired<Array<JsonInput<T>>, Array<JsonOutput<T>>>
{
	// Array constructor
	constructor(readonly pattern:Array<T> = [], readonly min?:number, readonly max?:number)
	{
		// Call creation on json
		super([]);

		// If a minimum was specified, and its invalid, throw error
		if(min !== undefined && (isNaN(min) || !Number.isSafeInteger(min) || min < 0))
			throw new Error('Invalid minimum');

		// If a maximum was specified, and its invalid, throw error
		if(max !== undefined && (isNaN(max) || !Number.isSafeInteger(max) || max < 0))
			throw new Error('Invalid maximum');

		// If a minimum and maximum were specified, and theyre invalid, throw error
		if(min !== undefined && max !== undefined && min > max)
			throw new Error('Invalid range');
	}

	// Function to set the specified array
	override set(value:Array<JsonInput<T>>):void { super.set([...value]); }

	// Function to validate the arrays value
	protected validate():void
	{
		// If the array has a minimum, and the values length is below it, throw error
		if(this.min !== undefined && this.value.length < this.min)
			throw new Error('Below minimum');

		// If the array has a maximum, and the values length is above it, throw error
		if(this.max !== undefined && this.value.length > this.max)
			throw new Error('Above maximum');

		// Loop through arrays values and validate
		for(let i:number = 0; i < this.value.length; i++)
		{
			// Attempt to validate the arrays value
			try
			{
				// Acquire this json and attempt to parse it
				const json:JsonRequired<any, JsonValue> = this.pattern.length > 0 ? this.pattern[i % this.pattern.length] : new JsonAny();
				json.parse(this.value[i]);
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

	// Function to serialize the arrays value
	serialize():Array<JsonOutput<T>>
	{
		// Create a container to store serialized values
		const serialized:Array<JsonOutput<T>> = [];

		// Loop through arrays values and serialize
		for(let i:number = 0; i < this.value.length; i++)
		{
			// Acquire this json
			const json:JsonRequired<any, JsonValue> = this.pattern.length > 0 ? this.pattern[i % this.pattern.length] : new JsonAny();

			// Set json to this value
			json.set(this.value[i]);

			// Add serialized value to serialized values
			serialized.push(json.serialize() as JsonOutput<T>);
		}

		// Return success
		return serialized;
	}
}