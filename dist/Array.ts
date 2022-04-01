// Package imports
import {JsonAny} from './Any';
import {JsonInput, JsonOutput, JsonValue} from './Json';
import {JsonRequired} from './Required';

// Array class
export class JsonArray<T extends JsonRequired<any, JsonValue> = JsonAny> extends JsonRequired<Array<JsonInput<T>>, Array<JsonOutput<T>>>
{
	// Array constructor
	constructor(readonly pattern:ReadonlyArray<T> = [], readonly min?:number, readonly max?:number)
	{
		// If a minimum was specified, and its invalid, throw error
		if(min !== undefined && (isNaN(min) || !Number.isSafeInteger(min) || min < 0))
			throw new Error('Invalid minimum');

		// If a maximum was specified, and its invalid, throw error
		if(max !== undefined && (isNaN(max) || !Number.isSafeInteger(max) || max < 0))
			throw new Error('Invalid maximum');

		// If a minimum and maximum were specified, and theyre invalid, throw error
		if(min !== undefined && max !== undefined && min > max)
			throw new Error('Invalid range');

		// Create a container to store values
		const values:Array<JsonInput<T>> = [];

		// If a mininum was specified, loop through and create minimum values
		if(min !== undefined)
		{
			// Loop through minimum and create values
			for(let v:number = 0; v < min; v++)
			{
				// Acquire this json and add it to values
				const json:JsonRequired<any, JsonValue> = pattern.length > 0 ? pattern[v % pattern.length] : new JsonAny();
				values.push(json.value);
			}
		}

		// Call creation on json
		super(values);
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
		for(let v:number = 0; v < this.value.length; v++)
		{
			// Attempt to validate the arrays value
			try
			{
				// Acquire this json and attempt to parse it
				const json:JsonRequired<any, JsonValue> = this.pattern.length > 0 ? this.pattern[v % this.pattern.length] : new JsonAny();
				json.parse(this.value[v]);
			}
			// On error, rethrow it
			catch(error)
			{
				// If the error is an error, prepend index information
				if(error instanceof Error)
					error.message = '[' + v.toString() + ']: ' + error.message;

				// Rethrow error
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

		// Create a container to store values
		const values:Array<JsonInput<T>> = [];

		// Loop through arrays values and attempt to parse
		for(let v:number = 0; v < this.value.length; v++)
		{
			// Attempt to parse the arrays value
			try
			{
				// Acquire this json
				const json:JsonRequired<any, JsonValue> = this.pattern.length > 0 ? this.pattern[v % this.pattern.length] : new JsonAny();

				// Attempt to parse json
				json.parse(this.value[v]);

				// Add json to values
				values.push(json.value);
			}
			// On error, rethrow it
			catch(error)
			{
				// If the error is an error, prepend index information
				if(error instanceof Error)
					error.message = '[' + v.toString() + ']: ' + error.message;

				// Rethrow error
				throw error;
			}
		}

		// Set the specified value
		this.set(values);
	}

	// Function to serialize the arrays value
	serialize():Array<JsonOutput<T>>
	{
		// Create a container to store serialized values
		const serialized:Array<JsonOutput<T>> = [];

		// Loop through arrays values and serialize
		for(let v:number = 0; v < this.value.length; v++)
		{
			// Acquire this json
			const json:JsonRequired<any, JsonValue> = this.pattern.length > 0 ? this.pattern[v % this.pattern.length] : new JsonAny();

			// Set json to this value
			json.set(this.value[v]);

			// Add serialized value to serialized values
			serialized.push(json.serialize() as JsonOutput<T>);
		}

		// Return success
		return serialized;
	}
}