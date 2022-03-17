// Package imports
import {Json, JsonInfer, JsonValue} from './Json';
import {JsonOptional} from './Optional';
import {JsonRequired} from './Required';

// Object types
type RequiredKeys<T> = Exclude<{[K in keyof T]:T[K] extends Exclude<T[keyof T], undefined> ? K : never}[keyof T], undefined>;
type OptionalKeys<T> = Exclude<{[K in keyof T]:T[K] extends Exclude<T[keyof T], undefined> ? never : K}[keyof T], undefined>;
type Restricted<T extends Record<string, Json>> = {[K in RequiredKeys<T>]:JsonRequired} & {[K in OptionalKeys<T>]?:JsonOptional};
type Value<T extends Record<string, Json>> = {[K in keyof T]:JsonInfer<T[K]>};

// Object class
export class JsonObject<T extends Record<string, Json> & Restricted<T>> extends JsonRequired
{
	// Object constructor
	constructor(readonly schema:T, value?:Value<T>)
	{
		// Call creation on json
		super();

		// If a value was specified, set it
		if(value != undefined)
			this.set(value);
	}

	// Function to get the objects value
	get():Value<T>
	{
		// Set the value to empty by default
		const value:{[key:string]:JsonValue} = {};

		// Acquire the schemas keys
		const keys:Array<string> = Object.keys(this.schema);

		// Loop through schemas keys and collect parameters
		for(let k:number = 0; k < keys.length; k++)
		{
			// Acquire this key, json, and parameter
			const key:string = keys[k];
			const json:Json = this.schema[key];
			const parameter:JsonValue|undefined = json.get();

			// If the parameter is valid, add it to value
			if(parameter != undefined)
				value[key] = parameter;
		}

		// Return success
		return JSON.parse(JSON.stringify(value));
	}

	// Function to set the objects value
	set(value:Value<T>):void
	{
		// Loop through schema and attempt to set
		for(const key in this.schema)
		{
			// Acquire this json
			const json:Json = this.schema[key];

			// Attempt to set the specified objects key
			try {
				json.set(key in value ? value[key] : undefined); }
			// On error, rethrow it
			catch(error)
			{
				// If the error is an error, rethrow it with key information
				if(error instanceof Error)
					throw new Error('{' + key + '}: ' + error.message);
				// Else, rethrow error
				else
					throw error;
			}
		}
	}

	// Function to update the objects value
	update(value:Partial<Value<T>>):void { this.set({...this.get(), ...value}); }

	// Function to parse the specified value
	parse(value:any):void
	{
		// If the specified value isnt an object, throw error
		if(typeof value != 'object')
			throw new Error('Invalid type');

		// Loop through schema and attempt to parse
		for(const key in this.schema)
		{
			// Acquire this json
			const json:Json = this.schema[key];

			// If the schema is required, and its not within specified value, throw error
			if(json instanceof JsonRequired && (!(key in value) || value[key] == undefined))
				throw new Error('Missing key ' + key);
		}

		// Set the specified value
		this.set(value);
	}
}