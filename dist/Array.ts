// Package imports
import {JsonAny} from './Any';
import {JsonInput, JsonOutput, JsonValue} from './Json';
import {JsonRequired} from './Required';

// Array class
export class JsonArray<T extends JsonRequired<any, JsonValue> = JsonAny> extends JsonRequired<Array<JsonInput<T>>, Array<JsonOutput<T>>>
{
	// Array constructor
	constructor(readonly pattern:ReadonlyArray<T> = [], readonly min?:number, readonly max?:number, value?:Array<JsonInput<T>>)
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

		// Acquire the specified value or create an empty container
		const values:Array<JsonInput<T>> = value !== undefined ? value : [];

		// If a value wasnt specified, and a mininum was, loop through and collect minimum values
		if(value === undefined && min !== undefined)
		{
			// If a pattern wasnt specified, loop through and collect minimum nulls
			if(pattern.length === 0)
			{
				// Loop through minimum and add nulls to values
				for(let v:number = 0; v < min; v++)
					values.push(null as JsonInput<T>);
			}
			// Else, loop through and collect minimum values
			else
			{
				// Loop through minimum and create values
				for(let v:number = 0; v < min; v++)
				{
					// Acquire this json and add it to values
					const json:JsonRequired<any, JsonValue> = pattern[v % pattern.length];
					values.push(json.value);
				}
			}
		}

		// Call creation on json
		super(values);

		// If a value was specified, attempt to validate it
		if(value !== undefined)
			this.validate();
	}

	// Function to validate the arrays value
	protected validate():void
	{
		// If the array has a minimum, and the values length is below it, throw error
		if(this.min !== undefined && this.value.length < this.min)
			throw new Error('Below minimum');

		// If the array has a maximum, and the values length is above it, throw error
		if(this.max !== undefined && this.value.length > this.max)
			throw new Error('Above maximum');

		// If the array doesnt have a pattern, return early
		if(this.pattern.length === 0)
			return;

		// Loop through arrays values and validate
		for(let v:number = 0; v < this.value.length; v++)
		{
			// Attempt to validate the arrays value
			try
			{
				// Acquire this json and attempt to parse it
				const json:JsonRequired<any, JsonValue> = this.pattern[v % this.pattern.length];
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

		// Create an any to parse values
		const any:JsonAny = new JsonAny();

		// Determine if the array has a pattern
		const hasPattern:boolean = this.pattern.length > 0;

		// Loop through arrays values and attempt to parse
		for(let v:number = 0; v < value.length; v++)
		{
			// Attempt to parse the arrays value
			try
			{
				// Acquire this json
				const json:JsonRequired<any, JsonValue> = hasPattern ? this.pattern[v % this.pattern.length] : any;

				// Attempt to parse json
				json.parse(value[v]);

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

		// Create an any to parse values
		const any:JsonAny = new JsonAny();

		// Determine if the array has a pattern
		const hasPattern:boolean = this.pattern.length > 0;

		// Loop through arrays values and serialize
		for(let v:number = 0; v < this.value.length; v++)
		{
			// Acquire this json
			const json:JsonRequired<any, JsonValue> = hasPattern ? this.pattern[v % this.pattern.length] : any;

			// Attempt to set json
			json.set(this.value[v]);

			// Add serialized value to serialized values
			serialized.push(json.serialize() as JsonOutput<T>);
		}

		// Return success
		return serialized;
	}
}